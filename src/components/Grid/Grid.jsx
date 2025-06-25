import React from 'react';
import Cell from '../Cell/Cell';
import './Grid.css';

function Grid({ grid, agentPos, foodPos, path, visitedNodes, onMouseDown, onMouseEnter, onMouseUp }) {
    if (!grid.length) {
        return null;
    }

    return (
        <div className="grid" onMouseUp={onMouseUp}>
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row">
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
                                cost={node.gScore} // Passa o custo
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