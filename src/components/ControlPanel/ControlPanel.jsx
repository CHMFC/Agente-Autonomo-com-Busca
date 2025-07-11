// src/components/ControlPanel/ControlPanel.jsx
import React from "react";
import "./ControlPanel.css";

function ControlPanel(props) {
  const {
    onStart,
    onReset,
    onAlgoChange,
    selectedAlgorithm,
    gameState,
    onSpeedChange,
    animationSpeed,
    terrainCosts,
    onCostChange,
  } = props;

  // Variáveis para controlar o estado da UI
  const isSearching = gameState === "searching" || gameState === "animatingPath";
  const isDone = gameState === "done";
  const isStartButtonDisabled = isSearching || isDone;

  // Função para determinar o texto do botão "Iniciar"
  const getStartButtonText = () => {
    if (isDone) {
      return "Encontrado";
    }
    if (isSearching) {
      return "Buscando...";
    }
    return "Iniciar Busca";
  };

  const handleDecrease = () => {
    onSpeedChange((prevSpeed) => Math.max(5, prevSpeed - 5));
  };

  const handleIncrease = () => {
    onSpeedChange((prevSpeed) => Math.min(100, prevSpeed + 5));
  };

  const handleCostInputChange = (e) => {
    const { name, value } = e.target;
    const newCost = Math.max(1, parseInt(value, 10) || 1);
    onCostChange(name, newCost);
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
          <option value="BFS">Busca em Largura (BFS)</option>
          <option value="DFS">Busca em Profundidade (DFS)</option>
          <option value="Greedy">Busca Gulosa (Greedy)</option>
          <option value="UniformCost">Custo Uniforme (UCS)</option>
        </select>
      </div>

      <div className="control-group">
        <label>Tempo por Passo</label>
        <div className="speed-selector">
          <button
            onClick={handleDecrease}
            disabled={isSearching || animationSpeed <= 5}
          >
            -
          </button>
          <span className="speed-display">{animationSpeed} ms</span>
          <button
            onClick={handleIncrease}
            disabled={isSearching || animationSpeed >= 100}
          >
            +
          </button>
        </div>
      </div>

      <div className="control-group">
        <label>Custos dos Terrenos</label>
        <div className="terrain-costs">
          <div className="terrain-cost-input">
            <label htmlFor="sand">Areia</label>
            <input
              type="number"
              id="sand"
              name="sand"
              value={terrainCosts.sand}
              onChange={handleCostInputChange}
              disabled={isSearching}
              min="1"
            />
          </div>
          <div className="terrain-cost-input">
            <label htmlFor="mud">Lama</label>
            <input
              type="number"
              id="mud"
              name="mud"
              value={terrainCosts.mud}
              onChange={handleCostInputChange}
              disabled={isSearching}
              min="1"
            />
          </div>
          <div className="terrain-cost-input">
            <label htmlFor="water">Água</label>
            <input
              type="number"
              id="water"
              name="water"
              value={terrainCosts.water}
              onChange={handleCostInputChange}
              disabled={isSearching}
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="control-group button-group">
        <button
          className="start-button"
          onClick={onStart}
          disabled={isStartButtonDisabled} 
        >
          {getStartButtonText()} {/* <-- Lógica do texto atualizada */}
        </button>
        <button
          className="reset-button"
          onClick={onReset}
          disabled={isSearching} // <-- Este botão não deve ser desabilitado quando "done"
        >
          Gerar Novo Mapa
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;