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

        // For thief boost
        this.boostTimeLeft = 0;
        this.boostMultiplier = 1.5;
    }

    giveSpeedBoost(seconds) {
        this.boostTimeLeft = Math.max(this.boostTimeLeft, seconds);
        this.speed = this.baseSpeed * this.boostMultiplier;
    }

    update(dt) {
        if (this.boostTimeLeft > 0) {
            this.boostTimeLeft -= dt;
            if (this.boostTimeLeft <= 0) {
                this.boostTimeLeft = 0;
                this.speed = this.baseSpeed;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}