import Grass from './Grass.js';
import Zebra from './Zebra.js';
import Lion from './Lion.js';

export default class World {
    constructor(width = 800, height = 500, settings = {}) {
        this.width = width;
        this.height = height;
        this.grass = [];
        this.zebras = [];
        this.lions = [];
        this.tick = 0;
        this.settings = settings;
        
        this.initWorld();
    }
    
    initWorld() {
        // Создаем траву
        for (let i = 0; i < this.settings.initialGrass; i++) {
            this.addGrass(
                Math.random() * this.width,
                Math.random() * this.height,
                this.settings.grass
            );
        }
        
        // Создаем зебр
        for (let i = 0; i < this.settings.initialZebra; i++) {
            this.addZebra(
                Math.random() * this.width,
                Math.random() * this.height,
                this.settings.zebra
            );
        }
        
        // Создаем львов
        for (let i = 0; i < this.settings.initialLion; i++) {
            this.addLion(
                Math.random() * this.width,
                Math.random() * this.height,
                this.settings.lion
            );
        }
    }
    
    addGrass(x, y, settings) {
        this.grass.push(new Grass(x, y, settings));
    }
    
    addZebra(x, y, settings) {
        this.zebras.push(new Zebra(x, y, this, settings));
    }
    
    addLion(x, y, settings) {
        this.lions.push(new Lion(x, y, this, settings));
    }
    
    update() {
        this.tick++;
        
        // Обновляем траву
        this.grass.forEach(grass => grass.update());
        
        // Обновляем зебр
        const newZebras = [];
        this.zebras = this.zebras.filter(zebra => {
            if (zebra.canReproduce()) {
                if (zebra.reproduce()) {
                    console.log("РАЗМНОЖЕНИЕ ЗЕБРЫ")
                    zebra.energy *= 0.7;
                    newZebras.push( new Zebra(
                        zebra.x + (Math.random() - 0.5) * 20,
                        zebra.y + (Math.random() - 0.5) * 20,
                        this,
                        zebra.settings
                    ));
                    console.log(`Зебр: ${this.zebras.length}`)
                }
            }
            return zebra.update();
        });

        this.zebras.push(...newZebras);
        
        // Обновляем львов
        const newLions = [];
        this.lions = this.lions.filter(lion => {
            if (lion.canReproduce()) {
                if (lion.reproduce()) {
                    lion.energy *= 0.7;
                    newLions.push(new Lion(
                        lion.x + (Math.random() - 0.5) * 20,
                        lion.y + (Math.random() - 0.5) * 20,
                        this,
                        lion.settings
                    ));
                }
            }
            return lion.update();
        });

        this.lions.push(...newLions);
        
        // Добавляем новую траву
        if (Math.random() < 0.1) {
            this.addGrass(
                Math.random() * this.width,
                Math.random() * this.height
            );
        }
    }
}