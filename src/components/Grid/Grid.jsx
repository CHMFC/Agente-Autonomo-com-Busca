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

  const getNodeType = (node) => {
    if (node.row === agentPos?.row && node.col === agentPos?.col) return 'agent';
    if (node.row === foodPos?.row && node.col === foodPos?.col) return 'food';
    if (path.some(p => p.row === node.row && p.col === node.col)) return 'path';
    if (visitedNodes.some(v => v.row === node.row && v.col === node.col)) return 'visited';
    if (node.isObstacle) return 'obstacle';
    return 'empty';
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((node) => {
              const nodeType = getNodeType(node);
              return (
                <Node
                  key={node.id}
                  type={nodeType}
                  onMouseDown={() => onMouseDown(node.row, node.col)}
                  onMouseEnter={() => onMouseEnter(node.row, node.col)}
                  onMouseUp={onMouseUp}
                  // A mudança principal está aqui: passamos o gScore do nó.
                  // Ele será usado como 'cost' dentro do componente Node.
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