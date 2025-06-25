import React from 'react';
import Node from '../Node/Node';
import './Grid.css';

const Grid = ({
  grid,
  visitedNodes,
  path,
  agentPos,
  foodPos,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  if (!grid || grid.length === 0) {
    return <div className="grid-container">Carregando grid...</div>;
  }

  // Esta função determina a aparência de cada célula (nó) no grid.
  // Ela estava faltando na minha resposta anterior.
  const getNodeType = (node) => {
    if (agentPos && node.row === agentPos.row && node.col === agentPos.col) return 'agent';
    if (foodPos && node.row === foodPos.row && node.col === foodPos.col) return 'food';
    // É importante checar o caminho ANTES dos nós visitados, pois o caminho faz parte dos visitados.
    if (path.some(p => p.row === node.row && p.col === node.col)) return 'path';
    if (visitedNodes.some(v => v.row === node.row && v.col === node.col)) return 'visited';
    if (node.isObstacle) return 'obstacle';
    return 'empty';
  };

  return (
    <div className="grid-container" onMouseUp={onMouseUp}>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((node) => {
              // Chamamos a função para obter o tipo do nó
              const nodeType = getNodeType(node);
              return (
                <Node
                  key={node.id}
                  type={nodeType}
                  onMouseDown={() => onMouseDown(node.row, node.col)}
                  onMouseEnter={() => onMouseEnter(node.row, node.col)}
                  // O onMouseUp foi movido para o container principal para melhor controle
                  // onMouseUp={onMouseUp} 
                  cost={node.gScore}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Grid);