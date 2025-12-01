import { styles } from '@styles/game';
export default class Enemy {
    constructor(y, speed = 3, hp = 5, points = 10 ) {
        this.x = 0;
        this.y = y || 0;
        this.speed = speed;
        this.active = true;
        this.width = 40;
        this.height = 40;
        this.hp = hp;
        this.maxHp = hp;
        this.points = points;
        this.damage = 1;
        this.path = null;
        this.currentPathIndex = 0;
        this.rotation = 0;
    }

    setPath(path) {
        this.path = path;
        this.currentPathIndex = 0;
    }

    getRotation() {
        return this.rotation;
    }

    update() {
        if (this.path && this.currentPathIndex < this.path.length) {
            const target = this.path[this.currentPathIndex];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.speed) {
                this.x = target.x;
                this.y = target.y;
                this.currentPathIndex++;
            } else {
                const angle = Math.atan2(dy, dx);
                this.rotation = angle * (180 / Math.PI);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        } else {
            this.x += this.speed;
            this.rotation = 0;
        }
    }

    isOutOfBounds(width) {
        return this.x > width;
    }

    setYPos(y) {
        this.y = y;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            startX: this.x,
            startY: this.y,
            endX: this.x + this.width,
            endY: this.y + this.height,
        };
    }

    collidesWith(projectile) {
        const dx = this.x - projectile.x+projectile.radius;
        const dy = this.y - projectile.y+projectile.radius;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.width  + projectile.radius; 
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.active = false;
        }
    }

    getColor() {
        const hpRatio = this.hp / this.maxHp;

        if (hpRatio > 0.75) return styles.full; // green
        if (hpRatio > 0.5) return styles.threeQuarters; // lime
        if (hpRatio > 0.25) return styles.half; // yellow
        if (hpRatio > 0.1) return styles.oneQuarter; // orange
        return styles.one; // red
    }
}
