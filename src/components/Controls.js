import React, { useState } from 'react';
import Button from './Button';
import SettingField from './SettingField';

// Получаем данные через пропсы вместо хука
const Controls = ({ 
  isRunning,
  speed,
  startSimulation,
  pauseSimulation,
  resetSimulation,
  setSpeed,
  settings,
  updateSettings
}) => {

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection == section ? null : section);
  }

  const updateSetting = (category, key, value) => {
    updateSettings(
      {...settings, 
        [category]:
        { 
          ...settings[category],
          [key]: value
        }
    });
  }

  return (
    <div className="controls-container">
      <div className="buttons-group">
        <Button 
          onClick={startSimulation} 
          disabled={isRunning}
        >
          Старт
        </Button>
        <Button 
          onClick={pauseSimulation} 
          disabled={!isRunning}
        >
          Пауза
        </Button>
        <Button onClick={resetSimulation}>
          Перезапуск
        </Button>
      </div>
      
      <div className="slider-group">
        <label htmlFor="speed-slider">Скорость симуляции: {speed}мс</label>
        <input
          id="speed-slider"
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div className="customization-section">
        <h3>Настройка симуляции</h3>
        
        {/* Grass */}
        <div className="category-section">
          <button 
            className="category-header" 
            onClick={() => toggleSection('grass')}
          >
            Настройки травы {openSection === 'grass' ? '▲' : '▼'}
          </button>
          
          {openSection === 'grass' && (
            <div className="params-grid">
              <SettingField 
                label="Энергетическая вместимость" 
                value={settings.grass.maxEnergy} 
                onChange={(v) => updateSetting('grass', 'maxEnergy', v)} 
              />
              <SettingField 
                label="Скорость роста" 
                value={settings.grass.growthRate} 
                onChange={(v) => updateSetting('grass', 'growthRate', v)} 
                step="0.01"
              />
            </div>
          )}
        </div>
        
        {/* Zebra */}
        <div className="category-section">
          <button 
            className="category-header" 
            onClick={() => toggleSection('zebra')}
          >
            Настройки зебр {openSection === 'zebra' ? '▲' : '▼'}
          </button>
          
          {openSection === 'zebra' && (
            <div className="params-grid">
              <SettingField 
                label="Макс. энергии" 
                value={settings.zebra.maxEnergy} 
                onChange={(v) => updateSetting('zebra', 'maxEnergy', v)} 
              />
              <SettingField 
                label="Максимальный возраст" 
                value={settings.zebra.maxAge} 
                onChange={(v) => updateSetting('zebra', 'maxAge', v)} 
              />
              <SettingField 
                label="скорость" 
                value={settings.zebra.speed} 
                onChange={(v) => updateSetting('zebra', 'speed', v)} 
                step="0.1"
              />
              <SettingField 
                label="Скорость поедания травы" 
                value={settings.zebra.consumptionRate} 
                onChange={(v) => updateSetting('zebra', 'consumptionRate', v)} 
              />
              <SettingField 
                label="Количество энергии (от макс.) для размножения" 
                value={settings.zebra.minReproductionEnergyFactor} 
                onChange={(v) => updateSetting('zebra', 'minReproductionEnergyFactor', v)} 
                step="0.01"
              />
              <SettingField 
                label="Возраст размножения" 
                value={settings.zebra.minReproductionAge} 
                onChange={(v) => updateSetting('zebra', 'minReproductionAge', v)} 
              />
              <SettingField 
                label="Вероятность размножения" 
                value={settings.zebra.reproductionProbability} 
                onChange={(v) => updateSetting('zebra', 'reproductionProbability', v)} 
                step="0.01"
              />
            </div>
          )}
        </div>
        
        {/* Lion */}
        <div className="category-section">
          <button 
            className="category-header" 
            onClick={() => toggleSection('lion')}
          >
            Настройки львов {openSection === 'lion' ? '▲' : '▼'}
          </button>
          
          {openSection === 'lion' && (
            <div className="params-grid">
              <SettingField 
                label="Максимальная энергия" 
                value={settings.lion.maxEnergy} 
                onChange={(v) => updateSetting('lion', 'maxEnergy', v)} 
              />
              <SettingField 
                label="Максимальный возраст" 
                value={settings.lion.maxAge} 
                onChange={(v) => updateSetting('lion', 'maxAge', v)} 
              />
              <SettingField 
                label="Скорость" 
                value={settings.lion.speed} 
                onChange={(v) => updateSetting('lion', 'speed', v)} 
                step="0.1"
              />
              <SettingField 
                label="Дальность обзора" 
                value={settings.lion.visionRange} 
                onChange={(v) => updateSetting('lion', 'visionRange', v)} 
              />
              <SettingField 
                label="Потребление энергии" 
                value={settings.lion.energyDecay} 
                onChange={(v) => updateSetting('lion', 'energyDecay', v)} 
                step="0.1"
              />
              <SettingField 
                label="Энергия при поедании зебры" 
                value={settings.lion.energyGainFromPrey} 
                onChange={(v) => updateSetting('lion', 'energyGainFromPrey', v)} 
              />
              <SettingField 
                label="Количество энергии (от макс.) для размножения" 
                value={settings.zebra.minReproductionEnergyFactor} 
                onChange={(v) => updateSetting('lion', 'minReproductionEnergyFactor', v)} 
                step="0.01"
              />
              <SettingField 
                label="Возраст размножения" 
                value={settings.zebra.minReproductionAge} 
                onChange={(v) => updateSetting('lion', 'minReproductionAge', v)} 
              />
              <SettingField 
                label="Вероятность размножения" 
                value={settings.zebra.reproductionProbability} 
                onChange={(v) => updateSetting('lion', 'reproductionProbability', v)} 
                step="0.01"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;