import React from 'react';
import Cell from '../Cell/Cell';
import './Grid.css';

function Grid({ grid, agentPos, foodPos, path, visitedNodes, onMouseDown, onMouseEnter, onMouseUp }) {
  if (!grid.length) {
    return null;
  }

  const getNodeType = (node) => {
    if (agentPos && node.row === agentPos.row && node.col === agentPos.col) return 'isAgent';
    if (foodPos && node.row === foodPos.row && node.col === foodPos.col) return 'isFood';
    return 'default';
  };

  return (
    <div className="grid" onMouseUp={onMouseUp}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((node) => {
            const isPath = path.some(p => p.row === node.row && p.col === node.col);
            // CORREÇÃO: v.col === node.col, e não v.col === v.col
            const isVisited = visitedNodes.some(v => v.row === node.row && v.col === node.col);
            const nodeType = getNodeType(node);
            
            return (
              <Cell
                key={node.id} // Agora a key funciona pois node.id existe
                type={node.type}
                isAgent={nodeType === 'isAgent'}
                isFood={nodeType === 'isFood'}
                isPath={isPath}
                isVisited={isVisited}
                onMouseDown={() => onMouseDown(node.row, node.col)}
                onMouseEnter={() => onMouseEnter(node.row, node.col)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default React.memo(Grid);