import { styles } from '@styles/game';

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
    constructor(x, y, speed=3, maxHp=5, damage=1, points=10, width=40, height=40) {
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
    }

    update() {
        this.x += this.#speed;
    }

    /**
     * Check if the enemy is beyond a boundary
     * @param {Number} width Boundary max width
     * @param {Number} height Boundary max height
     */
    isOutOfBounds(width, height) {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
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
