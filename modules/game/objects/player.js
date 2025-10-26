import { styles } from '@styles/game';


export default class Player {

    constructor(hp=100, width=10, height=10, size=50) {
        this.x = width - 100;
        this.y = height / 2;
        this.hp = hp;
        this.maxHp = hp;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.size = size;
    }

    setScore(score) {
        this.score = score;
    }

    /**
     * @params {Enemy} enemy It's Joe Momma!
     */
    enemyOutOfBounds(enemy) {
        if (enemy.x > this.width-1) {
            this.hp -= enemy.damage;
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.active = false;
        }
    }

    /**
     * Return the Player's HP
     */
    getHP() {
        return this.hp;
    }

    getPos(){
        return {
            x: this.x,
            y: this.y,
        };  
    }

    getSize(){
        return this.size;
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
