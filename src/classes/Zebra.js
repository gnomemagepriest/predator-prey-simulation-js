import Animal from './Animal.js';

export default class Zebra extends Animal {
    constructor(x, y, world, settings = {}) {
        super(x, y, world, settings);
        this.speed = settings.speed || 2;
        this.target = null;
        this.consumptionRate = settings.consumptionRate || 5;
        this.energyConsumptionRate = settings.energyConsumptionRate || 0.1;

        this.nearestLion = null;
        this.minLionDist = Infinity;

        // Мутации / эволцюция зебр
        this.geneVariation = settings.geneVariation || 0.1;
        this.speed = this.speed * (1 + (Math.random() - 0.5) * this.geneVariation);
        this.consumptionRate = this.consumptionRate * (1 + (Math.random() - 0.5) * this.geneVariation);
        this.energyConsumptionRate = this.energyConsumptionRate * (1 + (Math.random() - 0.5) * this.geneVariation);
        this.visionRange = settings.visionRange || 80;
    }

    findFood() {
        let bestGrass = null;
        let minDist = Infinity;
        
        this.world.grass.forEach(grass => {
            if (grass.energy > 5) {
                const dx = grass.x - this.x;
                const dy = grass.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < minDist) {
                    minDist = dist;
                    bestGrass = grass;
                }
            }
        });
        
        return bestGrass;
    }

    reproduce() {
        return !this.nearestLion && (Math.random() < this.reproductionProbability);
    }

    update() {
        if (!super.update()) return false;

        this.energy -= this.energyConsumptionRate;
        
        //
        // Поиск и побег от хищников
        //

        this.nearestLion = null;
        this.minLionDist = Infinity;
        
        // Нахождение ближайшего льва в пределах видимости
        this.world.lions.forEach(lion => {
            if (lion.alive) {
                const dx = lion.x - this.x;
                const dy = lion.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < this.visionRange && dist < this.minLionDist) {
                    this.minLionDist = dist;
                    this.nearestLion = lion;
                }
            }
        });
        
        if (this.nearestLion) {
            const dx = this.x - this.nearestLion.x;
            const dy = this.y - this.nearestLion.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            this.move(
                (dx/dist) * this.speed,
                (dy/dist) * this.speed
            );
            return true; // Побег от хищника - приоритет, другие действия пропускаются
        }

        //
        // Питание зебры
        //

        // Покинуть траву, если она съедена
        if (this.target && this.target.energy <= 5) {
            this.target = null;
        }
        
        // Поиск еды
        if (this.energy < 0.95 * this.maxEnergy && !this.target) {
            this.target = this.findFood();
        }
        
        // Если трава найдена
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 10) {
                // Едим траву
                const eaten = this.target.eaten(this.consumptionRate);
                this.energy = Math.min(this.maxEnergy, this.energy + eaten * 2);
            } else {
                // Движемся к еде
                const speed = this.speed;
                this.move((dx / dist) * speed, (dy / dist) * speed);
            }
        }
        
        return true;
    }

        getTooltipText() {
        return `Зебра:
${super.getTooltipText()}

Скорость: ${this.speed.toFixed(1)}
Потребление: ${this.consumptionRate.toFixed(1)}
Шанс размножения: ${(this.reproductionProbability * 100).toFixed(1)}%`;
    }
}