// Arquivo: src/components/Grid/Grid.jsx

import React from 'react';
import Cell from '../Cell/Cell';
import './Grid.css';

const CELL_SIZE = 25; // Define o tamanho da célula como uma constante

function Grid({ grid, agentPos, foodPos, path, visitedNodes, onMouseDown, onMouseEnter, onMouseUp }) {
    if (!grid.length) {
        return null;
    }

    return (
        <div className="grid-container" onMouseUp={onMouseUp}>
            {/* O grid de células continua o mesmo */}
            <div className="grid">
                {grid.map((row) => (
                    <div key={`row-${row[0].row}`} className="grid-row">
                        {row.map((node) => {
                            const isAgent = agentPos && node.row === agentPos.row && node.col === agentPos.col;
                            const isFood = foodPos && node.row === foodPos.row && node.col === foodPos.col;
                            const isPath = path.some(p => p.row === node.row && p.col === node.col);
                            const isVisited = visitedNodes.some(v => v.row === node.row && v.col === node.col);

                            return (
                                <Cell
                                    key={node.id}
                                    type={node.type}
                                    isAgent={isAgent}
                                    isFood={isFood}
                                    isPath={isPath}
                                    isVisited={isVisited}
                                    cost={node.gScore}
                                    onMouseDown={() => onMouseDown(node.row, node.col)}
                                    onMouseEnter={() => onMouseEnter(node.row, node.col)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* NOVA CAMADA SVG PARA AS LINHAS */}
            <svg className="grid-overlay">
                {visitedNodes.map((node, index) => {
                    // Começa a desenhar a partir do segundo nó visitado
                    if (index === 0 || !node.previousNode) {
                        return null;
                    }

                    const prev = node.previousNode;
                    const x1 = prev.col * CELL_SIZE + CELL_SIZE / 2;
                    const y1 = prev.row * CELL_SIZE + CELL_SIZE / 2;
                    const x2 = node.col * CELL_SIZE + CELL_SIZE / 2;
                    const y2 = node.row * CELL_SIZE + CELL_SIZE / 2;

                    return (
                        <line
                            key={`line-${node.id}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            className="visited-line"
                        />
                    );
                })}
            </svg>
        </div>
    );
}

export default React.memo(Grid);