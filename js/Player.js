class Player {
    constructor({ x, y, w, h, baseSpeed, color, role }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.baseSpeed = baseSpeed;
        this.speed = baseSpeed;
        this.color = color;
        this.role = role;

        // Speed boost
        this.speedBoostAmount = 0;
        this.speedBoostTimeLeft = 0;
    }

    giveSpeedBoost(amount, seconds) {
        // Stack speed boost
        this.speedBoostAmount += amount;
        // Max stacked speed at 45
        this.speedBoostAmount = Math.min(this.speedBoostAmount, 45);
        // Reset timer and not stacking time
        this.speedBoostTimeLeft = seconds;
        this.speed = this.baseSpeed + this.speedBoostAmount;
    }

    update(dt) {
        // Boost timer and reset speed
        if (this.speedBoostTimeLeft > 0) {
            this.speedBoostTimeLeft -= dt;

            if (this.speedBoostTimeLeft <= 0) {
                this.speedBoostTimeLeft = 0;
                this.speedBoostAmount = 0;
                // back to normal
                this.speed = this.baseSpeed;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}