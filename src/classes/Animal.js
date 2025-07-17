export default class Animal {
    constructor(x, y, world, settings = {}) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.settings = settings;

        this.energy = settings.maxEnergy || 100;
        this.maxEnergy = settings.maxEnergy || 100;
        this.age = settings.minAge || 0;
        this.maxAge = settings.maxAge || 100;
        this.alive = true;
        this.minReproductionEnergyFactor = settings.minReproductionEnergyFactor || 0.6;
        this.minReproductionAge = settings.minReproductionAge || 5;
        this.reproductionProbability = settings.reproductionProbability || 0.2;
    }

    move(dx, dy) {
        this.x = Math.max(0, Math.min(this.world.width, this.x + dx));
        this.y = Math.max(0, Math.min(this.world.height, this.y + dy));
    }

    canReproduce() {
        return this.energy > this.minReproductionEnergyFactor * this.maxEnergy 
            && this.age > this.minReproductionAge;
    }

    update() {
        this.age++;
        if (this.age > this.maxAge) {
            this.alive = false;
        }
        if (this.energy <= 0) {
            this.alive = false;
        }
        return this.alive;
    }

    getTooltipText() {
        return `Общие параметры:
Энергия: ${this.energy.toFixed(1)} / ${this.maxEnergy}
Возраст: ${this.age} / ${this.maxAge}
Состояние: ${this.alive ? 'жив' : 'мёртв'}`;
    }
}