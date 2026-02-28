class TileMap {
    constructor(map, tileSize, cols, rows) {
        this.map = map;
        this.tileSize = tileSize;
        this.cols = cols;
        this.rows = rows;
    }

    isWallAtTile(col, row) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return true;
        return this.map[row][col] === "1";
    }

    draw(ctx, width, height) {
        // Background (play area)
        ctx.fillStyle = "#e6e6e6";
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