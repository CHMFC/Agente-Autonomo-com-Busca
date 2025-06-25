// src/pages/MainPanel/MainPanel.jsx
import React from 'react';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import './MainPanel.css';

function MainPanel(props) {
  // --- GARANTINDO QUE AS PROPS SÃO RECEBIDAS E REPASSADAS ---
  const { 
    onStart, 
    onReset, 
    onAlgoChange, 
    selectedAlgorithm, 
    gameState,
    animationSpeed,
    onSpeedChange,
  } = props;

  return (
    <div className="main-panel-container">
      <h1>Visualizador de Busca</h1>
      <ControlPanel
        onStart={onStart}
        onReset={onReset}
        onAlgoChange={onAlgoChange}
        selectedAlgorithm={selectedAlgorithm}
        gameState={gameState}
        animationSpeed={animationSpeed}
        onSpeedChange={onSpeedChange}
      />
      <div className="description">
        <p>Selecione um algoritmo de busca e clique em "Iniciar Busca" para ver o agente encontrar o caminho.</p>
        <p>Use "Gerar Novo Mapa" para testar o algoritmo em diferentes cenários aleatórios.</p>
      </div>
    </div>
  );
}

export default MainPanel;