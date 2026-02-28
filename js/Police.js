class Police {
    constructor(x, y, size = 22) {
        this.x = x;
        this.y = y;

        // You can change this anytime to resize the sprite
        this.size = size;

        // Default: pupils look to the right
        this.lookDir = { x: 1, y: 0 };

        // Breathing animation
        this.bobTime = 0;
        this.bobSpeed = 6;
        this.bobAmount = 1.5;
    }

    setSize(newSize) {
        this.size = newSize;
    }

    // Call this when the player moves
    setLookDirection(x, y) {
        this.lookDir.x = x;
        this.lookDir.y = y;
    }

    update(dt) {
        this.bobTime += dt;
    }

    draw(ctx) {
        const s = this.size;

        // breathing/bobbing animation offset
        const bobOffsetY = Math.sin(this.bobTime * this.bobSpeed) * this.bobAmount;

        // draw everything slightly higher/lower
        const drawX = this.x;
        const drawY = this.y + bobOffsetY;

        this.drawGhostBody(ctx, drawX, drawY, s);
        this.drawEyes(ctx, drawX, drawY, s);
        this.drawHat(ctx, drawX, drawY, s);
    }

    drawGhostBody(ctx, x, y, s) {
        const w = s;
        const h = s;

        ctx.fillStyle = "#2aa7ff";

        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, w / 2, Math.PI, 0);
        ctx.lineTo(x + w, y + h);

        const bumps = 3;
        const bumpWidth = w / bumps;
        for (let i = 0; i < bumps; i++) {
            const bx = x + w - i * bumpWidth - bumpWidth / 2;
            ctx.quadraticCurveTo(bx, y + h - 4, bx - bumpWidth / 2, y + h);
        }

        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
    }

    drawEyes(ctx, x, y, s) {
        // Sizes
        const eyeRadius = s * 0.18;
        const pupilRadius = s * 0.08;

        // Eye positions
        const eyeGap = s * 0.12;
        const eyeCenterY = y + s * 0.45;
        const pairCenterX = x + s * 0.50;
        const leftEyeCenterX = pairCenterX - eyeRadius - eyeGap / 2;
        const rightEyeCenterX = pairCenterX + eyeRadius + eyeGap / 2;

        // White eyeballs
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(leftEyeCenterX, eyeCenterY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeCenterX, eyeCenterY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pupils hug the edge in the look direction
        const dirX = Math.sign(this.lookDir.x);
        const dirY = Math.sign(this.lookDir.y);

        const maxOffset = eyeRadius - pupilRadius - 0.5;
        const pupilOffsetX = dirX * maxOffset;
        const pupilOffsetY = dirY * maxOffset;

        ctx.fillStyle = "#1f5cff";
        ctx.beginPath();
        ctx.arc(leftEyeCenterX + pupilOffsetX, eyeCenterY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeCenterX + pupilOffsetX, eyeCenterY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawHat(ctx, x, y, s) {
        const hatW = s * 0.9;
        const hatH = s * 0.25;
        const hatX = x + (s - hatW) / 2;
        const hatY = y + s * 0.007;

        ctx.fillStyle = "#1b1b1b";
        ctx.fillRect(hatX, hatY, hatW, hatH);

        ctx.fillStyle = "#111";
        ctx.fillRect(hatX + hatW * 0.15, hatY + hatH, hatW * 0.7, hatH * 0.35);

        ctx.fillStyle = "#ffd54a";
        ctx.beginPath();
        ctx.arc(x + s / 2, hatY + hatH * 0.55, s * 0.05, 0, Math.PI * 2);
        ctx.fill();
    }
}