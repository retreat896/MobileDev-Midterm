import Enemy from "./Enemy";

export default class Projectile {
    // Leave private because these should ONLY be set during construction
    #angle
    #speed
    #damage
    #radius

    constructor(x, y, angle, speed=10, damage=1, radius=15) {
        this.x = x;
        this.y = y;
        this.bloom = 0;
        this.bloomMax = 0.05;
        this.bloomMin = -0.05;
        let randomBloom = Math.random() * (this.bloomMax - this.bloomMin) + this.bloomMin;
        this.bloom += randomBloom;
        // Private Values
        this.#angle = angle * (Math.PI / 180)+this.bloom;
        this.#speed = speed;
        this.#damage = damage;
        this.#radius = radius;
        
        this.active = true;
    }
    
    remove() {
        this.active = false;
    }

    update() {
        this.x += Math.cos(this.#angle) * this.#speed;
        this.y += Math.sin(this.#angle) * this.#speed;
    }

    /**
     * Get the projectile damage
     * @returns The object's damage value
     */
    getDamage() {
        return this.#damage;
    }

    /**
     * Check if the projectile is beyond a boundary
     * @param {Number} width Boundary max width
     * @param {Number} height Boundary max height
     */
    isOutOfBounds(width, height) {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }

    /**
     * Check if the projectile hit an enemy
     * @param {Enemy} enemy The enemy to check
     * @returns If the enemy was hit: true, otherwise false
     */
    collidesWith(enemy) {
        // Use the Display coords in calculation because collision is visual
        const dx = enemy.x - this.getDisplayX();
        const dy = enemy.y - this.getDisplayY();
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < enemy.getWidth(); 
    }


    // Kris: I'm not sure of the exact math for the sprite placement, so please correct this if wrong.
    // Thanks. 
    
    /**
     * Get the position the object is displayed at
     * @returns The displayed x-position
     */
    getDisplayX() {
        return this.x - this.#radius / 2;
    }

    /**
     * Get the position the object is displayed at
     * @returns The displayed y-position
     */
    getDisplayY() {
        return this.y - this.#radius / 2;
    }
}