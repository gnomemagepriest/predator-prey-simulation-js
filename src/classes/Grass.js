export default class Grass {
    constructor(x, y, settings = {}) {
        this.x = x;
        this.y = y;
        this.energy = settings.maxEnergy || 100;
        this.maxEnergy = settings.maxEnergy || 100;
        this.growthRate = settings.growthRate || 0.1;
        this.size = 5;
    }

    update() {
        if (this.energy < this.maxEnergy) {
            this.energy = Math.min(this.maxEnergy, this.energy + this.growthRate);
        }
        return true;
    }

    eaten(amount) {
        const taken = Math.min(this.energy, amount);
        this.energy -= taken;
        return taken;
    }

    getTooltipText() {
        return `Трава:
Энергия: ${this.energy.toFixed(1)} / ${this.maxEnergy}
Скорость роста: ${this.growthRate.toFixed(2)}
Размер: ${this.size}`;
    }
}