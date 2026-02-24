// Create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.body.style.margin = "0";
document.body.style.background = "#8fd694";  // gras green backg
document.body.appendChild(canvas);

// wider than tall canvas
const TILE_SIZE = 28;
const MAP_COLS = 28;
const MAP_ROWS = 18;

const cssWidth = TILE_SIZE * MAP_COLS;
const cssHeight = TILE_SIZE * MAP_ROWS;

//  resolution settings
const dpr = window.devicePixelRatio || 1;
canvas.width = cssWidth * dpr;
canvas.height = cssHeight * dpr;
canvas.style.width = cssWidth + "px";
canvas.style.height = cssHeight + "px";
ctx.scale(dpr, dpr);

// 1 = wall, 0 = path, coding the map 
const map = [
    "1111111111111111111111111111",
    "1000000000000110000000000001",
    "1011110111110110111110111101",
    "1010000100000000000010000101",
    "1010111110111111111011110101",
    "1000100000100000001000000101",
    "1110101110101111101011110101",
    "1000001000001000001000000001",
    "1011111011111011111011111101",
    "1000000000000000000000000001",
    "1011111011111111111011111101",
    "1000001000001000001000000001",
    "1110101110111011101011110101",
    "1000100000100000001000000101",
    "1010111110111111111011110101",
    "1010000000000000000000000101",
    "1000000000000110000000000001",
    "1111111111111111111111111111",
];

// Draw bricks
function drawBrick(x, y, size) {
    ctx.fillStyle = "#8B5A2B"; // warm brown
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = "#5a3418";
    ctx.lineWidth = 1;

    const brickHeight = size / 4;
    const brickWidth = size / 2;

    for (let row = 0; row < 4; row++) {
        const offset = row % 2 === 0 ? 0 : brickWidth / 2;

        for (let col = 0; col < 2; col++) {
            const brickX = x + col * brickWidth + offset;

            if (brickX + brickWidth <= x + size) {
                ctx.strokeRect(
                    brickX,
                    y + row * brickHeight,
                    brickWidth,
                    brickHeight
                );
            }
        }
    }
}

// Draw map
function drawMap() {

    ctx.fillStyle = "#8fd694";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            if (map[row][col] === "1") {
                drawBrick(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

drawMap();