import React from 'react';
import './Cell.css';

const Cell = ({
    type,
    isAgent,
    isFood,
    isPath,
    isVisited,
    cost,
    onMouseDown,
    onMouseEnter,
}) => {
    // Define a classe base do terreno
    const terrainClass = `cell-${type}`;

    // Adiciona as classes do agente, comida, caminho e visitado conforme necessário
    const classNames = [
        'cell',
        terrainClass, // Sempre aplica a classe do terreno
        isAgent ? 'cell-agent' : '',
        isFood ? 'cell-food' : '',
        isPath ? 'cell-path' : '',
        isVisited ? 'cell-visited' : '',
    ].join(' ');

    const shouldShowCost = isVisited && !isPath && !isAgent && !isFood && cost > 0 && cost !== Infinity;

    return (
        <div
            className={classNames}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
        >
            {shouldShowCost && <span className="cell-cost">{Math.round(cost)}</span>}
        </div>
    );
};

export default React.memo(Cell);