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
    // CORREÇÃO: Garante que isAgent e isFood sobreponham outros estilos
    const cellTypeClass = isAgent ? 'cell-agent' : isFood ? 'cell-food' : `cell-${type}`;

    const classNames = [
        'cell',
        cellTypeClass,
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