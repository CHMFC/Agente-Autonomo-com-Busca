// src/components/Node/Node.jsx
import React from 'react';
import './Node.css';

// Adicione 'cost' aos props desestruturados
const Node = ({ type, onMouseDown, onMouseEnter, onMouseUp, cost }) => {
  const classNames = `node ${type}`;

  // Só exibe o custo se o nó foi visitado e o custo é um número
  const shouldShowCost = type === 'visited' && typeof cost === 'number' && cost > 0;

  return (
    <div
      className={classNames}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    >
      {/* Adicione a lógica para renderizar o custo */}
      {shouldShowCost && <span className="node-cost">{Math.round(cost)}</span>}
    </div>
  );
};

export default React.memo(Node);