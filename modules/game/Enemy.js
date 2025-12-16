import { styles } from '@styles/game';

const MIN_SPEED = 1.5;
const MAX_SPEED = 4.5;
const MIN_HP = 3;
const MAX_HP = 10;

export default class Enemy {
    // Leave these private because these should ONLY be set during construction
    #speed
    #maxHp;
    #width;
    #height;
    #hp;
    #points;
    #damage;

    /**
     * 
     * @param {Number} x The x coordinate
     * @param {Number} y The y coordinate
     * @param {Number} speed Enemy speed
     * @param {Number} maxHp Maximum health
     * @param {Number} points Point value
     */
    constructor(x, y, speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED, maxHp = Math.floor(Math.random() * (MAX_HP - MIN_HP + 1)) + MIN_HP, damage = 1, points = 10, width = 40, height = 40) {
        // X and Y are NOT optional
        this.x = x;
        this.y = y;

        // Private values
        this.#speed = speed;
        this.#maxHp = maxHp;
        this.#width = width;
        this.#height = height;
        this.#points = points;
        this.#damage = damage;
        this.#hp = this.#maxHp;

        this.active = true;
        this.path = null;
        this.currentPathIndex = 0;
        this.rotation = 0;
    }

    setPath(path) {
        this.path = path;
        this.currentPathIndex = 0;
    }

    update() {
        if (this.path && this.currentPathIndex < this.path.length) {
            const target = this.path[this.currentPathIndex];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.#speed) {
                this.x = target.x;
                this.y = target.y;
                this.currentPathIndex++;
            } else {
                const angle = Math.atan2(dy, dx);
                this.rotation = angle * (180 / Math.PI); // If rotation is needed
                this.x += Math.cos(angle) * this.#speed;
                this.y += Math.sin(angle) * this.#speed;
            }
        } else {
            this.x += this.#speed;
        }
    }

    /**
     * Check if the enemy has reached the end of its path
     */
    hasReachedEndOfPath() {
        return this.path && this.currentPathIndex >= this.path.length;
    }

    /**
     * Check if the enemy is beyond a boundary
     * @param {Number} width Boundary max width
     * @param {Number} height Boundary max height
     */
    isOutOfBounds(width, height) {
        const buffer = 100;
        return this.x < -buffer || this.x > width + buffer || this.y < -buffer || this.y > height + buffer;
    }

    /**
     * Hurt 'em
     * @param {Number} damage Number of health points to remove 
     */
    takeDamage(damage) {
        // Prevent negative damage
        if (damage < 1) {
            throw new Error("Silly Enemy, you can't heal yourself through pain.");
        }

        this.#hp -= damage;
    }

    getColor() {
        const hpRatio = this.#hp / this.#maxHp;

        if (hpRatio > 0.75) return styles.full; // green
        if (hpRatio > 0.5) return styles.threeQuarters; // lime
        if (hpRatio > 0.25) return styles.half; // yellow
        if (hpRatio > 0.1) return styles.oneQuarter; // orange
        return styles.one; // red
    }

    getSpeed() {
        return this.#speed;
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }

    getMaxHp() {
        return this.#maxHp;
    }

    getHp() {
        return this.#hp;
    }

    getPoints() {
        return this.#points;
    }

    getDamage() {
        return this.#damage;
    }
}