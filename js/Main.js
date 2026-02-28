// Create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Center everything on screen
document.body.style.margin = "0";
document.body.style.background = "#d3d3d3"; // light grey background
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";

document.body.appendChild(canvas);

// Background Music (start at random time and restart randomly)
const music = new Audio("assets/song1.mp3");
music.volume = 0.5;

// Function to start music at a random time
function playRandom() {
    const randomTime = Math.random() * music.duration;
    music.currentTime = randomTime;
    music.play();
}

// Wait for metadata to load to know the duration
music.addEventListener("loadedmetadata", () => {
    // Play initially at random
    playRandom();
});

// When the music ends, start again at a new random time
music.addEventListener("ended", () => {
    playRandom();
});

// Play on first user click
window.addEventListener("click", () => {
    if (music.readyState >= 2) { // metadata loaded
        playRandom();
    } else {
        music.addEventListener("loadedmetadata", playRandom, { once: true });
    }
}, { once: true });

// Map settings (wider than tall)
const TILE_SIZE = 28;
const MAP_COLS = 28;
const MAP_ROWS = 18;

const cssWidth = TILE_SIZE * MAP_COLS;
const cssHeight = TILE_SIZE * MAP_ROWS;

// High DPI Fix
const dpr = window.devicePixelRatio || 1;
canvas.width = cssWidth * dpr;
canvas.height = cssHeight * dpr;
canvas.style.width = cssWidth + "px";
canvas.style.height = cssHeight + "px";
ctx.scale(dpr, dpr);

// 1 = wall, 0 = path
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
    "1000100000000000001000000101",
    "1010111110111111111111110101",
    "1010000000000000000010000101",
    "1011110110000110001000100001",
    "1111111111111111111111111111",
];

// Draw brick wall tile
function drawBrick(x, y, size, ctx) {
    ctx.fillStyle = "#333333";
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = "#1f1f1f";
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

// Expose drawBrick globally so TileMap.js can use it
window.drawBrick = drawBrick;

// Create TileMap and Game
const tileMap = new TileMap(map, TILE_SIZE, MAP_COLS, MAP_ROWS);
const game = new Game(canvas, ctx, tileMap, cssWidth, cssHeight);

// No drawMap() call here.
// Game.loop() will call tileMap.draw() each frame and draw players + collectibles.