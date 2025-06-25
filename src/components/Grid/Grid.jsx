// src/components/Grid/Grid.jsx
import React from 'react';
import Cell from '../Cell/Cell';
import './Grid.css';

// MUDANÇA IMPORTANTE: Adicionamos agentPos e foodPos como props
function Grid({ grid, agentPos, foodPos, path, visitedNodes }) {
  // Se o grid ainda não foi gerado, não renderize nada para evitar erros.
  if (!grid.length) {
    return null;
  }

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell) => {
            // Lógica para verificar se esta célula contém o agente ou a comida
            const isAgent = agentPos && agentPos.row === cell.row && agentPos.col === cell.col;
            const isFood = foodPos && foodPos.row === cell.row && foodPos.col === cell.col;
            const isPath = path.some(p => p.row === cell.row && p.col === cell.col);
            const isVisited = visitedNodes.some(v => v.row === cell.row && v.col === cell.col);

            return (
              <Cell
                key={cell.col}
                type={cell.type}
                // Passando as props corretas para o componente Cell
                isAgent={isAgent}
                isFood={isFood}
                isPath={isPath}
                isVisited={isVisited}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;