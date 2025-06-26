import React from 'react';


const infoPanelStyles = `
  .info-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 25px;
    background-color: rgba(18, 25, 39, 0.85);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #eceff1;
    width: 100%;
    max-width: 950px;
    margin-bottom: 20px;
    box-sizing: border-box;
  }

  .info-panel-controls {
    display: flex;
    gap: 15px;
  }

  .info-panel-controls button {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(30, 41, 59, 0.8);
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
  }

  .info-panel-controls button:hover:not(:disabled) {
    background-color: rgba(30, 41, 59, 1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .info-panel-controls button:disabled {
    background-color: rgba(18, 25, 39, 0.5);
    color: #6c757d;
    cursor: not-allowed;
  }

  .info-panel-divider {
    width: 1px;
    align-self: stretch;
    background-color: rgba(255, 255, 255, 0.1);
    margin: -12px 25px;
  }

  .info-panel-stats {
    display: flex;
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: none;
    padding-bottom: 0;
  }

  .stat-label {
    font-weight: 400;
    font-size: 0.95rem;
    color: #a0aec0;
  }

  .stat-value {
    font-weight: 700;
    font-size: 1.1rem;
    color: #4caf50;
  }

  .stat-item .reset-counter-btn {
    padding: 4px 10px;
    font-size: 0.8rem;
    background-color: #c53030;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 5px;
    transition: background-color 0.2s;
  }

  .stat-item .reset-counter-btn:hover {
    background-color: #9b2c2c;
  }
`;

function InfoPanel({
  isPaused,
  canPause,
  canReset,
  handlePauseResume,
  handleReset,
  totalCost,
  foodsFound,
  handleResetCounter
}) {
  return (
    <>
      <style>{infoPanelStyles}</style>
      <div className="info-panel">
        {/* Grupo de Controles */}
        <div className="info-panel-controls">
          <button onClick={handlePauseResume} disabled={!canPause}>
            {isPaused ? 'Continuar' : 'Pausar'}
          </button>
          <button onClick={handleReset} disabled={!canReset}>
            Resetar Animação
          </button>
        </div>

        {/* Divisor Visual */}
        <div className="info-panel-divider"></div>

        {/* Grupo de Estatísticas */}
        <div className="info-panel-stats">
          <div className="stat-item">
            <span className="stat-label">Custo Total:</span>
            <span className="stat-value">{totalCost > 0 ? totalCost.toFixed(2) : 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Foods Encontrados:</span>
            <span className="stat-value">{foodsFound}</span>
            <button onClick={handleResetCounter} className="reset-counter-btn">Zerar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoPanel;
