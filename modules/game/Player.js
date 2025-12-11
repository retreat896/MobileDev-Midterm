import { styles } from '@styles/game';


export default class Player {
    // Leave private because these should ONLY be set during construction
    #maxHp;
    #hp;
    #score;
    #width;
    #height;

    /**
     * @param {Number} x The x coordinate
     * @param {Number} y The y coordinate
     * @param {Number} maxHp Maximum health
     * @param {Number} width The display width
     * @param {Number} height The display height
     */
    constructor(x, y, maxHp=100, width=50, height=50) {
        // Publically Accessible Values
        // X and Y are NOT optional
        this.x = x;
        this.y = y;
        this.rotation = 0;

        // These are private because they don't need to be managed by an outside class.
        // X, Y, and rotation all can be adjusted up or down. 
        // Below, the values never, or only change in a specific direction.
        this.#maxHp = maxHp;
        this.#hp = this.#maxHp;
        this.#score = 0;
        this.#width = width;
        this.#height = height;
    }

    // Should add Enemy direction, and verify direction
    /**
     * Check if an enemy has made it past the player
     * @params {Enemy} The enemy that may have escaped
     */
    enemyOutOfBounds(enemy) {
        return enemy.x > this.x;
    }

    /**
     * Hurt 'em
     * @param {Number} damage Number of health points to remove 
     */
    takeDamage(damage) {
        // Prevent negative damage
        if (damage < 1) {
            throw new Error("Silly Player, you can't heal yourself through pain.");
        }

        this.#hp -= damage;
    }

    /**
     * Add points to the score
     * @param {Number} points Amount to increment score by 
     */
    addScore(points) {
        // Logging but not error in case ever want to take away points
        if (points < 0) {
            console.error("Losing points? -- Are you sure you know what you're doing?");
        }

        this.#score += points;
    }

    /**
     * @returns The maximumm health points
     */
    getMaxHp() {
        return this.#maxHp;
    }

    /**
     * @returns The current health points
     */
    getHp() {
        return this.#hp;
    }

    /**
     * @returns The current score
     */
    getScore() {
        return this.#score;
    }

    /**
     * @returns The display width
     */
    getWidth() {
        return this.#width;
    }

    /**
     * @returns The display height
     */
    getHeight() {
        return this.#height;
    }

    setOffset(offset){
        this.offset = offset;
    }

    getOffset(){
        return this.offset
    }

    /**
     * Get the position the object is displayed at
     * @returns The displayed x-position
     */
    getDisplayX() {
        return this.x - this.#width;
    }

    /**
     * Get the position the object is displayed at
     * @returns The displayed y-position
     */
    getDisplayY() {
        return this.y - this.#height;
    }

    /**
     * Get the display color, based on health
     * @returns a JSON object with color settings for StyleSheet use
     */
    getColor() {
        const hpRatio = this.#hp / this.#maxHp;

        if (hpRatio > 0.75) return styles.full; // green
        if (hpRatio > 0.5) return styles.threeQuarters; // lime
        if (hpRatio > 0.25) return styles.half; // yellow
        if (hpRatio > 0.1) return styles.oneQuarter; // orange
        return styles.one; // red
    }
}