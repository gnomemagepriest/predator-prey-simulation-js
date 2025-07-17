import { React, useState, useCallback, useEffect, useRef } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Controls from './components/Controls';
import World from './classes/World';
import './styles/main.css';

function App() {
  const [resetTrigger, setResetTrigger] = useState(false);
  const [settings, setSettings] = useState({
    grass: {
      maxEnergy: 100,
      growthRate: 0.1,
      size: 5
    },
    zebra: {
      maxEnergy: 100,
      maxAge: 300,
      speed: 2,
      consumptionRate: 5,
      energyConsumptionRate: 0.1,
      minReproductionEnergyFactor: 0.8,
      minReproductionAge: 50,
      reproductionProbability: 0.01,
      geneVariation: 0.3,
      visionRange: 80
    },
    lion: {
      maxEnergy: 150,
      maxAge: 450,
      speed: 3.5,
      visionRange: 500,
      energyDecay: 0.5,
      energyGainFromPrey: 45,
      minReproductionEnergyFactor: 0.8,
      minReproductionAge: 40,
      reproductionProbability: 0.05
    },
    initialGrass: 100,
    initialLion: 2,
    initialZebra: 15
  });

  const [world, setWorld] = useState(() => {
    const initialWorld = new World(800, 500, settings);
    initialWorld.initWorld(settings);
    return initialWorld;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const updateCount = useRef(0);

  // Обработчик сброса
  const handleReset = useCallback(() => {
    const initialWorld = new World(800, 500, settings);
    initialWorld.initWorld(settings);
    setWorld(initialWorld);
  }, [settings]);

  // Функции для управления симуляцией
  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Функция для обновления мира
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setWorld(prevWorld => {
        const newWorld = new World(prevWorld.width, prevWorld.height, prevWorld.settings);
        newWorld.grass = prevWorld.grass;
        newWorld.zebras = prevWorld.zebras;
        newWorld.lions = prevWorld.lions;
        newWorld.update();
        return newWorld;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Обновление настроек
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  }

  return (
    <div className="app-container">
      <h1>Симуляция "Хищник - Жертва"</h1>
      
      {world 
      ? (<SimulationCanvas 
        world={world} 
        isRunning={isRunning} 
        resetTrigger={resetTrigger}
        updateCount = {updateCount}
      />)
      : (<div>Инициализация...</div>)}

      <Controls 
        isRunning={isRunning}
        speed={speed}
        startSimulation={startSimulation}
        pauseSimulation={pauseSimulation}
        resetSimulation={handleReset}
        setSpeed={setSpeed}
        settings={settings}
        updateSettings={updateSettings}
      />
    </div>
  );
}

export default App;