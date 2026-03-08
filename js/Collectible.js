class Collectible {
    constructor(x, y, emoji = "🔖") {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.collected = false;
    }

    draw(ctx) {
        if (this.collected) {
            return;
        }

        // Draw data emoji
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px sans-serif";
        ctx.fillText(this.emoji, this.x, this.y);
        ctx.restore();
    }

    checkPickup(player) {
        if (this.collected) return false;

        const px = player.x + player.w / 2;
        const py = player.y + player.h / 2;
        const dx = px - this.x;
        const dy = py - this.y;
        const pickupRadius = Math.min(player.w, player.h) * 0.45;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pickupRadius) {
            this.collected = true;
            return true;
        }
        return false;
    }
}