class Collectible {
    constructor(x, y, r = 6) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.collected = false;
    }

    draw(ctx) {
        if (this.collected) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "#00aaff";
        ctx.fill();
    }

    checkPickup(player) {
        if (this.collected) return false;

        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        const dx = px - this.x;
        const dy = py - this.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.r + Math.min(player.w, player.h) * 0.35) {
            this.collected = true;
            return true;
        }
        return false;
    }
}