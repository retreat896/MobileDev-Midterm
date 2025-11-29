export default class Projectile {
    constructor(x, y, angle, speed = 10, damage = 1, radius = 5) {
        this.x = x;
        this.y = y;
        this.angle = angle * (Math.PI / 180);
        this.speed = speed;
        this.active = true;
        this.damage = damage;
        this.radius = 5;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    isOutOfBounds(width, height) {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }

    remove() {
        this.active = false;
    }

    getPos() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
