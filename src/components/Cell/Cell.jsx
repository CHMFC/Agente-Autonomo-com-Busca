// src/components/Cell/Cell.jsx
import React from 'react';
import './Cell.css';

function Cell({ type, isAgent, isFood, isPath, isVisited }) {
  // A classe da célula principal agora só se preocupa com o terreno e o estado da busca
  const cellClassName = `cell cell-${type} ${isPath ? 'path' : ''} ${isVisited ? 'visited' : ''}`;

  return (
    <div className={cellClassName}>
      {/* Renderizamos um elemento filho APENAS se for a célula do agente */}
      {isAgent && <div className="agent-entity"></div>}

      {/* Renderizamos um elemento filho APENAS se for a célula da comida */}
      {isFood && <div className="food-entity"></div>}
    </div>
  );
}

export default Cell;