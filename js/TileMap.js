class TileMap {
    constructor(map, tileSize, cols, rows) {
        this.map = map;
        this.tileSize = tileSize;
        this.cols = cols;
        this.rows = rows;
    }

    isWallAtTile(col, row) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return true;
        }
        return this.map[row][col] === "1";
    }

    isPathAtTile(col, row) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return false;
        }
        return this.map[row][col] === "0";
    }

    tileCenterToPixel(col, row) {
        return {
            x: (col + 0.5) * this.tileSize,
            y: (row + 0.5) * this.tileSize
        };
    }

    // Checks that a rectangle placed at (x,y,w,h) doesn't overlap any wall tile
    rectIntersectsWall(x, y, w, h) {
        const leftCol = Math.floor(x / this.tileSize);
        const rightCol = Math.floor((x + w - 1) / this.tileSize);
        const topRow = Math.floor(y / this.tileSize);
        const bottomRow = Math.floor((y + h - 1) / this.tileSize);

        for (let row = topRow; row <= bottomRow; row++) {
            for (let col = leftCol; col <= rightCol; col++) {
                if (this.isWallAtTile(col, row)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Find a random path tile where an object of size w, h fits without touching walls
    getRandomSpawnTileForRect(w, h, tries = 2000) {
        for (let i = 0; i < tries; i++) {
            const col = Math.floor(Math.random() * this.cols);
            const row = Math.floor(Math.random() * this.rows);

            if (!this.isPathAtTile(col, row)) {
                continue;
            }

            const center = this.tileCenterToPixel(col, row);
            const x = center.x - w / 2;
            const y = center.y - h / 2;

            // Reject if it would overlap any wall tile
            if (this.rectIntersectsWall(x, y, w, h)) {
                continue;
            }

            return { col, row, x, y };
        }

        // If nothing found, return null
        return null;
    }

    draw(ctx, width, height) {
        ctx.fillStyle = "#7f3b3bff";
        ctx.fillRect(0, 0, width, height);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.map[row][col] === "1") {
                    drawBrick(col * this.tileSize, row * this.tileSize, this.tileSize, ctx);
                }
            }
        }
    }
}