class Game {
    constructor(canvas, ctx, tileMap, width, height) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tileMap = tileMap;
        this.width = width;
        this.height = height;

        // Sizes
        this.playerSize = { w: 18, h: 18 };
        this.collectibleRadius = 6;
        this.collectibleCount = 15;

        // Spawns police top-left
        const policeSpawn = this.findNearestValidSpawnFromTile(
            0,
            0,
            this.playerSize.w,
            this.playerSize.h
        );

        // Spawns thief bottom-right
        const thiefSpawn = this.findNearestValidSpawnFromTile(
            this.tileMap.cols - 1,
            this.tileMap.rows - 1,
            this.playerSize.w,
            this.playerSize.h
        );

        // Create playable police
        this.police = new Player({
            x: policeSpawn.x,
            y: policeSpawn.y,
            w: this.playerSize.w,
            h: this.playerSize.h,
            baseSpeed: 120,
            color: "blue",
            role: "police",
        });

        // Create playable thief
        this.thief = new Player({
            x: thiefSpawn.x,
            y: thiefSpawn.y,
            w: this.playerSize.w,
            h: this.playerSize.h,
            baseSpeed: 120,
            color: "red",
            role: "thief",
        });

        // Spawn collectibles randomly
        this.collectibles = this.spawnCollectibles(
            this.collectibleCount,
            this.collectibleRadius
        );

        // Create police sprite
        this.policeSprite = new Police(this.police.x, this.police.y, 18);
        // Create thief sprite
        this.thiefSprite = new Thief(this.thief.x, this.thief.y, 18);

        this.input = new Input();

        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    // Find nearest valid spawn from tile
    findNearestValidSpawnFromTile(startCol, startRow, w, h) {
        const totalCols = this.tileMap.cols;
        const totalRows = this.tileMap.rows;

        // Checks if a tile index is inside the map grid
        function isInsideMap(col, row) {
            if (col >= 0 && col < totalCols && row >= 0 && row < totalRows) {
                return true;
            } else {
                return false;
            }
        }

        // Checks tile if already visited
        const visited = Array.from({ length: totalRows }, () =>
            Array(totalCols).fill(false)
        );

        // Array queue containing tiles we still want to check
        const tilesToCheck = [];

        // Start from the given tile
        if (isInsideMap(startCol, startRow)) {
            tilesToCheck.push({ col: startCol, row: startRow });
            visited[startRow][startCol] = true;
        }

        // We move in 4 directions: right, left, down, up
        const neighborSteps = [
            { deltaCol: 1, deltaRow: 0 },   // right
            { deltaCol: -1, deltaRow: 0 },  // left
            { deltaCol: 0, deltaRow: 1 },   // down
            { deltaCol: 0, deltaRow: -1 },  // up
        ];

        // Keep searching until there are no tiles left to check
        while (tilesToCheck.length > 0) {
            // Take the oldest tile in the queue
            const currentTile = tilesToCheck.shift();
            const currentCol = currentTile.col;
            const currentRow = currentTile.row;

            // If this tile is a path tile, test if our player rectangle fits here
            if (this.tileMap.isPathAtTile(currentCol, currentRow)) {
                // Find the center pixel of this tile
                const center = this.tileMap.tileCenterToPixel(currentCol, currentRow);

                // Convert center position into top-left corner for a rectangle (w,h)
                const spawnX = center.x - w / 2;
                const spawnY = center.y - h / 2;

                // Make sure rectangle does not overlap any wall tiles
                const overlapsWall = this.tileMap.rectIntersectsWall(spawnX, spawnY, w, h);

                if (!overlapsWall) {
                    return {
                        col: currentCol,
                        row: currentRow,
                        x: spawnX,
                        y: spawnY
                    };
                }
            }

            // If not valid, add its neighbors to the queue
            for (const step of neighborSteps) {
                const nextCol = currentCol + step.deltaCol;
                const nextRow = currentRow + step.deltaRow;

                // Skip if outside the grid
                if (!isInsideMap(nextCol, nextRow)) {
                    continue;
                }

                // Skip if already visited
                if (visited[nextRow][nextCol]) {
                    continue;
                }

                // Mark visited and add to queue
                visited[nextRow][nextCol] = true;
                tilesToCheck.push({ col: nextCol, row: nextRow });
            }
        }

        // If we checked everything and found nothing valid
        return null;
    }

    // Spawn collectibles
    spawnCollectibles(count, radius) {
        const result = [];
        const triesPerCollectible = 3000;

        // Treat collectible as a small rect for wall checks
        const boxSize = radius * 2;

        for (let i = 0; i < count; i++) {
            let placed = false;

            for (let t = 0; t < triesPerCollectible; t++) {
                const col = Math.floor(Math.random() * this.tileMap.cols);
                const row = Math.floor(Math.random() * this.tileMap.rows);

                if (!this.tileMap.isPathAtTile(col, row)) {
                    continue;
                }

                const center = this.tileMap.tileCenterToPixel(col, row);

                // Test wall overlap
                const rectX = center.x - boxSize / 2;
                const rectY = center.y - boxSize / 2;
                if (this.tileMap.rectIntersectsWall(rectX, rectY, boxSize, boxSize)) {
                    continue;
                }

                const cx = center.x;
                const cy = center.y;

                // Avoid spawning on players
                if (this.circleHitsPlayer(cx, cy, radius, this.police)) {
                    continue;
                }
                if (this.circleHitsPlayer(cx, cy, radius, this.thief)) {
                    continue;
                }

                // Avoid overlapping other collectibles
                let overlapsOther = false;
                for (const c of result) {
                    const dx = c.x - cx;
                    const dy = c.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < c.r + radius + 4) {
                        overlapsOther = true;
                        break;
                    }
                }
                if (overlapsOther) {
                    continue;
                }

                result.push(new Collectible(cx, cy, radius));
                placed = true;
                break;
            }
        }

        return result;
    }

    // Checks collectibles and players overlap
    circleHitsPlayer(cx, cy, radius, player) {
        const closestX = Math.max(player.x, Math.min(cx, player.x + player.w));
        const closestY = Math.max(player.y, Math.min(cy, player.y + player.h));
        const dx = cx - closestX;
        const dy = cy - closestY;
        if ((dx * dx + dy * dy) < (radius * radius)) {
            return true;
        } else {
            return false;
        }
    }

    syncPoliceSprite(dt) {
        // Keep sprite position similar to player position
        this.policeSprite.x = this.police.x;
        this.policeSprite.y = this.police.y;
        this.policeSprite.update(dt);
    }

    syncThiefSprite(dt) {
        // Keep sprite position similar to player position
        this.thiefSprite.x = this.thief.x;
        this.thiefSprite.y = this.thief.y;
        this.thiefSprite.update(dt);
    }

    movePlayerWithCollision(player, dx, dy) {
        // horizontal movement
        if (dx !== 0) {
            const nextX = player.x + dx;
            if (!this.tileMap.rectIntersectsWall(nextX, player.y, player.w, player.h)) {
                player.x = nextX;
            }
        }

        // vertical movement
        if (dy !== 0) {
            const nextY = player.y + dy;
            if (!this.tileMap.rectIntersectsWall(player.x, nextY, player.w, player.h)) {
                player.y = nextY;
            }
        }
    }

    movePolice(dt) {
        // Police movement uses WASD keys
        const policeSpeed = 80;

        let moveX = 0;
        let moveY = 0;

        // WASD
        if (this.input.isDown("a")) moveX -= 1;
        if (this.input.isDown("d")) moveX += 1;
        if (this.input.isDown("w")) moveY -= 1;
        if (this.input.isDown("s")) moveY += 1;

        // Prevent diagonal speed boost
        if (moveX !== 0 && moveY !== 0) {
            const inv = 1 / Math.sqrt(2);
            moveX *= inv;
            moveY *= inv;
        }

        // Convert to pixels
        const dx = moveX * policeSpeed * dt;
        const dy = moveY * policeSpeed * dt;

        // Move with collision
        this.movePlayerWithCollision(this.police, dx, dy);

        // Update pupil direction if moving
        if (moveX !== 0 || moveY !== 0) {
            const dirX = Math.sign(moveX);
            const dirY = Math.sign(moveY);
            this.policeSprite.setLookDirection(dirX, dirY);
        }
    }

    moveThief(dt) {
        // Thief movement uses arrow keys
        const thiefSpeed = 60; // slower than police

        let thiefMoveX = 0;
        let thiefMoveY = 0;

        // Arrow keys
        if (this.input.isDown("arrowleft")) thiefMoveX -= 1;
        if (this.input.isDown("arrowright")) thiefMoveX += 1;
        if (this.input.isDown("arrowup")) thiefMoveY -= 1;
        if (this.input.isDown("arrowdown")) thiefMoveY += 1;

        // Prevent diagonal speed boost
        if (thiefMoveX !== 0 && thiefMoveY !== 0) {
            const inv = 1 / Math.sqrt(2);
            thiefMoveX *= inv;
            thiefMoveY *= inv;
        }

        // Converts to pixels
        const thiefDx = thiefMoveX * thiefSpeed * dt;
        const thiefDy = thiefMoveY * thiefSpeed * dt;

        // Move with collision
        this.movePlayerWithCollision(this.thief, thiefDx, thiefDy);

        // Update mouth direction if moving
        if (thiefMoveX !== 0 || thiefMoveY !== 0) {

            // Face right/left
            if (Math.abs(thiefMoveX) >= Math.abs(thiefMoveY)) {

                if (thiefMoveX > 0) {
                    this.thiefSprite.setFacing("right");
                } else {
                    this.thiefSprite.setFacing("left");
                }

            } else {
                // Face down/up
                if (thiefMoveY > 0) {
                    this.thiefSprite.setFacing("down");
                } else {
                    this.thiefSprite.setFacing("up");
                }
            }
        }
    }

    update(dt) {
        this.thief.update(dt);
        this.police.update(dt);

        // Thief gains speed boost at pickup
        for (const c of this.collectibles) {
            if (c.checkPickup(this.thief)) {
                this.thief.giveSpeedBoost(1.0); // 1 second boost
            }
        }

        this.syncPoliceSprite(dt);
        this.syncThiefSprite(dt);
        this.movePolice(dt);
        this.moveThief(dt);
    }

    draw() {
        this.tileMap.draw(this.ctx, this.width, this.height);

        for (const c of this.collectibles) {
            c.draw(this.ctx);
        }

        // Draw police character art
        this.policeSprite.draw(this.ctx);
        this.thiefSprite.draw(this.ctx);
    }

    loop(now) {
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }
}