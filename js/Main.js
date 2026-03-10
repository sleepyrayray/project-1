// Create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Add canvas to page (CSS will center it)
document.body.appendChild(canvas);

// Play Again Button
const playAgainBtn = document.createElement("button");
playAgainBtn.textContent = "Play Again";
document.body.appendChild(playAgainBtn);

// Play Again style
playAgainBtn.style.display = "none";
playAgainBtn.style.position = "fixed";
playAgainBtn.style.left = "50%";
playAgainBtn.style.top = "50%";
playAgainBtn.style.transform = "translate(-50%, 80px)";
playAgainBtn.style.padding = "12px 18px";
playAgainBtn.style.fontSize = "18px";
playAgainBtn.style.cursor = "pointer";
playAgainBtn.style.borderRadius = "10px";
playAgainBtn.style.border = "none";
playAgainBtn.style.background = "#ffffff";
playAgainBtn.style.color = "#000000";

// Reload the page when clicked
playAgainBtn.addEventListener("click", () => {
    window.location.reload();
});
// Show or hide
window.showPlayAgainButton = function () {
    playAgainBtn.style.display = "block";
};
window.hidePlayAgainButton = function () {
    playAgainBtn.style.display = "none";
};

// Background Music
const music = new Audio("assets/audio/background.mp3");
music.volume = 0.25;

// Array of collecting sounds
const collectSounds = [
    new Audio("assets/audio/collect-1.mp3"),
    new Audio("assets/audio/collect-2.mp3"),
    new Audio("assets/audio/collect-3.mp3"),
];

const gameStartSound = new Audio("assets/audio/game-start.mp3");
const teleportSound = new Audio("assets/audio/teleport.mp3");
const policeWinSound = new Audio("assets/audio/police-win.mp3");
const thiefWinSound = new Audio("assets/audio/thief-win.mp3");

// Volumes
const VOLUME = {
    collect: 0.45,
    start: 0.2,
    teleport: 0.45,
    policeWin: 0.6,
    thiefWin: 0.6,
};

// Set base volumes
for (const s of collectSounds) {
    s.volume = VOLUME.collect;
    gameStartSound.volume = VOLUME.start;
    teleportSound.volume = VOLUME.teleport;
    policeWinSound.volume = VOLUME.policeWin;
    thiefWinSound.volume = VOLUME.thiefWin;
}

// Play cloned sounds
function playSfx(baseAudio, volume) {
    const s = baseAudio.cloneNode();
    s.volume = volume;
    s.currentTime = 0;
    s.play();
}

// Play random collect sound
function playRandomCollect() {
    const index = Math.floor(Math.random() * collectSounds.length);
    const base = collectSounds[index];
    playSfx(base, VOLUME.collect);
}

// Expose SFX functions globally
window.playCollectSound = function () {
    playRandomCollect();
};
window.playGameStartSound = function () {
    playSfx(gameStartSound, VOLUME.start);
};
window.playTeleportSound = function () {
    playSfx(teleportSound, VOLUME.teleport);
};
window.playPoliceWinSound = function () {
    playSfx(policeWinSound, VOLUME.policeWin);
};
window.playThiefWinSound = function () {
    playSfx(thiefWinSound, VOLUME.thiefWin);
};

// Start music at a random time
function playMusicRandomTime() {
    const randomTime = Math.random() * music.duration;
    music.currentTime = randomTime;
    music.play().catch(() => { });
}

// When the music loads, play at a random time
music.addEventListener("loadedmetadata", () => {
    playMusicRandomTime();
});
// When the music ends, restart at a new random time
music.addEventListener("ended", () => {
    playMusicRandomTime();
});
// Play on first user click
window.addEventListener(
    "click",
    () => {
        if (music.readyState >= 2) {
            playMusicRandomTime();
        } else {
            music.addEventListener("loadedmetadata", playMusicRandomTime, { once: true });
        }
    },
    { once: true }
);

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

// Ensure the canvas appears at the correct size on the page.
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
    "1110101110111011100011110101",
    "1000100000000000001000000101",
    "1010111110111111111111110101",
    "1010000000100000100010000101",
    "1011110110001110001000110001",
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