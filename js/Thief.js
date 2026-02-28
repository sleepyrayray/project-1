class Thief {
    constructor(x, y, size = 22) {
        this.x = x;
        this.y = y;
        this.size = size;

        // Default facing direction
        this.facing = "left";

        // Mouth animation
        this.mouthTime = 0;
        this.mouthSpeed = 3.0;

        // Mouth range
        this.mouthMin = 0.05;
        this.mouthMax = 0.50;
    }

    setSize(newSize) {
        this.size = newSize;
    }

    // Call this later when movement is coded:
    // "left", "right", "up", "down"
    setFacing(direction) {
        this.facing = direction;
    }

    update(dt) {
        this.mouthTime += dt;
    }

    draw(ctx) {
        const s = this.size;
        const cx = this.x + s / 2;
        const cy = this.y + s / 2;
        const r = s / 2;

        // Smooth mouth animation
        const t = (Math.sin(this.mouthTime * this.mouthSpeed) + 1) / 2;

        // Convert to actual mouth angle
        const mouthOpen = this.mouthMin + (this.mouthMax - this.mouthMin) * t;

        // Mouth points based on facing direction
        const facingAngle = this.getFacingAngle();

        // Draw thief body
        ctx.fillStyle = "#ffb700ff"; // yellow-ish
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, facingAngle + mouthOpen, facingAngle - mouthOpen, false);
        ctx.closePath();
        ctx.fill();

        // Draw one dot eye
        this.drawEye(ctx, cx, cy, s);
    }

    drawEye(ctx, cx, cy, s) {
        const eyeRadius = s * 0.12; // small dot
        let eyeX = cx;
        let eyeY = cy - s * 0.18;

        // Eye positions based on facing direction
        if (this.facing === "left") {
            eyeX = cx + s * 0.10;
        } else if (this.facing === "right") {
            eyeX = cx - s * 0.10;
        } else if (this.facing === "up") {
            eyeX = cx - s * 0.25;
            eyeY = cy - s * 0.0001;
        } else if (this.facing === "down") {
            eyeX = cx - s * 0.25;
            eyeY = cy - s * 0.01;
        }

        // Red eye to make thief look like a bad guy
        ctx.fillStyle = "#ff0000ff";
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    getFacingAngle() {
        if (this.facing === "right") {
            return 0;
        }
        if (this.facing === "down") {
            return Math.PI / 2;
        }
        if (this.facing === "left") {
            return Math.PI;
        }
        if (this.facing === "up") {
            return -Math.PI / 2;
        }
        // default to left
        return Math.PI;
    }
}