// src/components/ControlPanel/ControlPanel.jsx
import React from 'react';
import './ControlPanel.css';

function ControlPanel(props) {
  const { 
    onStart, 
    onReset, 
    onAlgoChange, 
    selectedAlgorithm, 
    gameState,
    onSpeedChange,
    animationSpeed, // Recebe o valor numérico
  } = props;

  const isSearching = gameState === 'searching' || gameState === 'animatingPath';

  const handleDecrease = () => {
    // Garante que onSpeedChange seja chamado com um novo valor
    onSpeedChange(prevSpeed => Math.max(5, prevSpeed - 5));
  };

  const handleIncrease = () => {
    // Garante que onSpeedChange seja chamado com um novo valor
    onSpeedChange(prevSpeed => Math.min(100, prevSpeed + 5));
  };

  return (
    <div className="control-panel">
      
      <div className="control-group">
        <label htmlFor="algo-select">Algoritmo de Busca</label>
        <select 
          id="algo-select"
          onChange={(e) => onAlgoChange(e.target.value)} 
          disabled={isSearching} 
          value={selectedAlgorithm}
        >
          <option value="A*">A* (A-Estrela)</option>
        </select>
      </div>

      <div className="control-group">
        <label>Tempo por Passo</label>
        <div className="speed-selector">
          <button onClick={handleDecrease} disabled={isSearching || animationSpeed <= 5}>-</button>
          {/* --- AQUI ESTÁ A CORREÇÃO PRINCIPAL --- */}
          {/* Exibe o valor da prop `animationSpeed` */}
          <span className="speed-display">{animationSpeed} ms</span>
          <button onClick={handleIncrease} disabled={isSearching || animationSpeed >= 100}>+</button>
        </div>
      </div>

      <div className="control-group button-group">
        <button className="start-button" onClick={onStart} disabled={isSearching}>
          {isSearching ? 'Buscando...' : 'Iniciar Busca'}
        </button>
        <button className="reset-button" onClick={onReset} disabled={isSearching}>
          Gerar Novo Mapa
        </button>
      </div>

    </div>
  );
}

export default ControlPanel;