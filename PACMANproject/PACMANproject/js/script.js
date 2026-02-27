// centered screen canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.appendChild(canvas);

const TILE_SIZE = 32;
const MAP_COLS = 28;
const MAP_ROWS = 18;

// 1 = building, 0 = road, 2 = park
const map = [
    "1111111111111111111111111111",
    "1000000000000220000000000001",
    "1011110111110110111110111101",
    "1010000100000000000010000101",
    "1010111110111111111011110101",
    "1000100000100000001000000101",
    "1110101110101111101011110101",
    "1000001000002000001000000001",
    "1011111011111011111011111101",
    "1000000000000000000000000001",
    "1011111011111111111011111101",
    "1000001000001000001000000001",
    "1110101110111011101011110101",
    "1000100000100000001000000101",
    "1010111110111111111011110101",
    "1010000000000000000000000101",
    "1000000000000220000000000001",

    // city like
    "1011111111111111111111111101",  // building blocks
    "1000000000000000000000000001",  // road row
    "1111111111111111111111111111"
];

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawMap();
}

// Blue buildings
function drawBuilding(x, y, size) {
    ctx.fillStyle = "#2979ff"; // strong city blue
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = "#82b1ff"; // light blue windows
    ctx.lineWidth = 1;

    const w = size / 4;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            ctx.strokeRect(
                x + c * w + 5,
                y + r * w + 5,
                w - 10,
                w - 10
            );
        }
    }
}

// Grey roads
function drawRoad(x, y, size) {
    ctx.fillStyle = "#9e9e9e"; // clean grey
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = "#e0e0e0"; // lane marking
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y + 6);
    ctx.lineTo(x + size / 2, y + size - 6);
    ctx.stroke();
}

// Green parks
function drawPark(x, y, size) {
    ctx.fillStyle = "#66bb6a"; // fresh green
    ctx.fillRect(x, y, size, size);

    ctx.fillStyle = "#2e7d32"; // tree
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawMap() {
    // Soft sky blue background
    ctx.fillStyle = "#e3f2fd";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const mapWidth = MAP_COLS * TILE_SIZE;
    const mapHeight = MAP_ROWS * TILE_SIZE;

    const offsetX = (window.innerWidth - mapWidth) / 2;
    const offsetY = (window.innerHeight - mapHeight) / 2;

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = map[row][col];
            const x = offsetX + col * TILE_SIZE;
            const y = offsetY + row * TILE_SIZE;

            if (tile === "1") drawBuilding(x, y, TILE_SIZE);
            if (tile === "0") drawRoad(x, y, TILE_SIZE);
            if (tile === "2") drawPark(x, y, TILE_SIZE);
        }
    }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();