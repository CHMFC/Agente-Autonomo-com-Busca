import React from 'react';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import './MainPanel.css';

function MainPanel(props) {
  // Garantimos que TODAS as props, incluindo as novas, são recebidas.
  const { 
    onStart, 
    onReset, 
    onAlgoChange, 
    selectedAlgorithm, 
    gameState,
    animationSpeed,
    onSpeedChange,
    terrainCosts,
    onCostChange,
  } = props;

  return (
    <div className="main-panel-container">
      <h1>Visualizador de Busca</h1>
      <ControlPanel
        // ... e repassadas para o ControlPanel
        onStart={onStart}
        onReset={onReset}
        onAlgoChange={onAlgoChange}
        selectedAlgorithm={selectedAlgorithm}
        gameState={gameState}
        animationSpeed={animationSpeed}
        onSpeedChange={onSpeedChange}
        terrainCosts={terrainCosts}
        onCostChange={onCostChange}
      />
      <div className="description">
        <p>Selecione um algoritmo de busca e clique em "Iniciar Busca" para ver o agente encontrar o caminho. Use "Gerar Novo Mapa" para testar o algoritmo em diferentes cenários aleatórios.</p>
        <p><b>Grupo formado por:</b><br></br>
            Carlos Henrique Matos Fontaine Costa <br></br>
            Lucas Emmanuel Gomes de Lucena <br></br>
            Nicolas Cavalcanti de Brito Barros <br></br>
            Rômulo Artur Arruda dos Santos Andrade <br></br>
            Vitor Negromonte Cabral de Oliveira</p>
      </div>
    </div>
  );
}

export default MainPanel;