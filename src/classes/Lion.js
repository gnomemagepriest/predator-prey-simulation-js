import Animal from './Animal.js';

export default class Lion extends Animal {
    constructor(x, y, world, settings = {}) {
        super(x, y, world, settings);
        this.speed = settings.speed || 3;
        this.visionRange = settings.visionRange || 100;
        this.energyDecay = settings.energyDecay || 0.5;
        this.energyGainFromPrey = settings.energyGainFromPrey || 40;
        this.lastPreySeen = 0;
        this.target = null;
        this.directionX = Math.random() - 0.5;
        this.directionY = Math.random() - 0.5;
        this.directionTicks = 0;
    }

    // Поиск ближайшей зебры
    findPrey() {
        let bestZebra = null;
        let minDist = Infinity;
        
        this.world.zebras.forEach(zebra => {
            if (zebra.alive) {
                const dx = zebra.x - this.x;
                const dy = zebra.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < this.visionRange && dist < minDist) {
                    minDist = dist;
                    bestZebra = zebra;
                }
            }
        });
        
        return bestZebra;
    }

    reproduce() {
        return (!this.target || !this.target.alive) && (Math.random() < this.reproductionProbability);
    }

    update() {
        if (!super.update()) return false;
        
        this.energy -= this.energyDecay; // Базовая трата энергии
        
        // Поиск добычи
        if (this.energy < 0.85 * this.maxEnergy) {
            this.target = this.findPrey();
        }
        
        if (this.target && this.target.alive) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 15) {
                // Атака
                this.target.alive = false;
                this.energy = Math.min(this.maxEnergy, this.energy + 40);

                this.directionX = Math.random() - 0.5;
                this.directionY = Math.random() - 0.5;
                this.directionTicks = 0;
            } else {
                // Преследование
                this.move((dx / dist) * this.speed, (dy / dist) * this.speed);
            } 
        } else {
            this.directionTicks++;

            this.move(
                this.directionX * this.speed * 2,
                this.directionY * this.speed * 2
            );

            if (this.directionTicks % 15 == 0) {
                this.directionX = Math.random() - 0.5;
                this.directionY = Math.random() - 0.5;
            }
        }
        return true;   
    }

    getTooltipText() {
        return `Лев:
${super.getTooltipText()}

Скорость: ${this.speed.toFixed(1)}
Дальность зрения: ${this.visionRange}
Потеря энергии: ${this.energyDecay.toFixed(1)}/ход`;
    }
}