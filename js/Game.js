class Game {
    constructor(canvas, ctx, tileMap, width, height) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tileMap = tileMap;
        this.width = width;
        this.height = height;

        this.thief = new Player({ x: 40, y: 40, w: 18, h: 18, baseSpeed: 120, color: "red", role: "thief" });
        this.police = new Player({ x: width - 60, y: height - 60, w: 18, h: 18, baseSpeed: 120, color: "blue", role: "police" });

        // Example collectible positions (later spawn on valid path tiles)
        this.collectibles = [
            new Collectible(140, 140),
            new Collectible(300, 200),
            new Collectible(500, 350),
        ];

        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        this.thief.update(dt);
        this.police.update(dt);

        // Pickup logic: thief gains speed boost
        for (const c of this.collectibles) {
            if (c.checkPickup(this.thief)) {
                this.thief.giveSpeedBoost(1.0); // 1 second boost (tweak as desired)
            }
        }
    }

    draw() {
        this.tileMap.draw(this.ctx, this.width, this.height);

        for (const c of this.collectibles) c.draw(this.ctx);

        this.thief.draw(this.ctx);
        this.police.draw(this.ctx);
    }

    loop(now) {
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }
}