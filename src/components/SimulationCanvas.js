import React, { useRef, useEffect, useState, useCallback } from 'react';
import './../styles/simulation.css';

const SimulationCanvas = ({ world, isRunning, resetTrigger, updateCount }) => {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Чистый канвас, если мира нет
    if (!world || !canvasRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Подсчет средней скорости зебр
    const calculateAverageSpeed = () => {
      if (world.zebras.length === 0) {
        return 0;
      }

      const totalSpeed = world.zebras.reduce((sum, zebra) => sum + zebra.speed, 0) / world.zebras.length;
      return totalSpeed;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Отрисовка травы
      world.grass.forEach(grass => {
        const size = 3 + (grass.energy / grass.maxEnergy) * 5;
        ctx.fillStyle = `rgba(0, ${150 + (grass.energy / grass.maxEnergy) * 105}, 0, 1)`;
        ctx.fillRect(grass.x - size/2, grass.y - size/2, size, size);
      });

      // Отрисовка зебр
      world.zebras.forEach(zebra => {
        const size = 8;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + (zebra.energy / zebra.maxEnergy) * 0.7})`;
        ctx.fillRect(zebra.x - size/2, zebra.y - size/2, size, size);
      });

      // Отрисовка львов
      world.lions.forEach(lion => {
        const size = 12;
        ctx.fillStyle = 'rgba(200, 100, 0, 1)';
        ctx.beginPath();
        ctx.arc(lion.x, lion.y, size/2, 0, Math.PI * 2);
        ctx.fill();
      });

      //
      // Вывод количества зебр и львов
      //

      // Количество зебр
      const zebraCount = world.zebras.length;
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("Зебры: " + zebraCount, 10, 20);

      // Количество львов
      const lionCount = world.lions.length;
      ctx.fillText("Львы: " + lionCount, 10, 40);

      // Средняя скорость зебр
  
      ctx.fillText("Средняя скорость зебр: " + calculateAverageSpeed().toFixed(2), 10, 60);
    };

    // Кадр рисуем всегда
    draw();
    
    // Анимация только при запущенной симуляции
    if (isRunning) {
      const animationId = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(animationId);
    }
  }, [world, isRunning, updateCount, resetTrigger]);

  const handleMouseMove = (e) => {
    if (!world || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let entity = null;

    // Проверка львов (высший приоритет)
    for (const lion of world.lions) {
      const dx = lion.x - x;
      const dy = lion.y - y;

      if (Math.sqrt(dx*dx + dy*dy) < 10) {
        entity = {type: 'lion', data: lion};
        break;
      }
    }

    // Проверка зебр (средний приоритет)
    if (!entity) {
      for (const zebra of world.zebras) {
        const dx = zebra.x - x;
        const dy = zebra.y - y;

        if (Math.sqrt(dx*dx + dy*dy) < 8) {
          entity = {type: 'zebra', data: zebra};
          break;
        }
      }
    }

    // Проверка траву (низкий приоритет)
    if (!entity) {
      for (const grass of world.grass) {
        const dx = grass.x - x;
        const dy = grass.y - y;

        if (Math.sqrt(dx*dx + dy*dy) < 8) {
          entity = {type: 'grass', data: grass};
          break;
        }
      }
    }

    setTooltip(entity 
      ? {
        entity, 
        position: {x: e.clientX, y: e.clientY},
        text: entity.data.getTooltipText()
      } : null);
  }

  return (
    <div className="simulation-container">
      <canvas 
        key={`canvas-${resetTrigger}`}
        ref={canvasRef} 
        width={800} 
        height={500} 
        className="simulation-canvas"
        onMouseMove={handleMouseMove}
        onMouseOut={() => setTooltip(null)}
      />
      {tooltip && (
      <div 
        className="tooltip"
        style={{
          position: 'fixed',
          left: tooltip.position.x,
          top: tooltip.position.y,
          zIndex: 100
        }}
      >

        {tooltip.text.split('\n').map((line, i) => (
        <div key={i}>{line}</div>
      ))}

      </div>
      )}
    </div>
  );
};

export default SimulationCanvas;