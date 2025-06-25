// src/utils/mapGenerator.js

const TERRAIN_DEFAULTS = {
  OBSTACLE: { type: 'obstacle', cost: Infinity, isObstacle: true },
  SAND:     { type: 'sand',     isObstacle: false }, 
  MUD:      { type: 'mud',      isObstacle: false },
  WATER:    { type: 'water',    isObstacle: false },
};

const getRandomEmptyPosition = (grid, excludedPositions = []) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let position = null;

  while (position === null) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (!grid[r][c].isObstacle) {
      const isExcluded = excludedPositions.some(p => p.row === r && p.col === c);
      if (!isExcluded) {
        position = { row: r, col: c };
      }
    }
  }
  return position;
};

export function generateRandomMap(rows, cols, terrainCosts) {
  const newGrid = [];

  const TERRAIN_TYPES = {
    OBSTACLE: { ...TERRAIN_DEFAULTS.OBSTACLE },
    SAND:     { ...TERRAIN_DEFAULTS.SAND, cost: terrainCosts.sand },
    MUD:      { ...TERRAIN_DEFAULTS.MUD, cost: terrainCosts.mud },
    WATER:    { ...TERRAIN_DEFAULTS.WATER, cost: terrainCosts.water },
  };

  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      const randomValue = Math.random();
      let terrain;

      if (randomValue < 0.25) {
        terrain = TERRAIN_TYPES.OBSTACLE;
      } else if (randomValue < 0.70) {
        terrain = TERRAIN_TYPES.SAND;
      } else if (randomValue < 0.90) {
        terrain = TERRAIN_TYPES.MUD;
      } else {
        terrain = TERRAIN_TYPES.WATER;
      }
      
      currentRow.push({
        id: `${row}-${col}`, // CORREÇÃO: Adicionando a ID única
        row,
        col,
        ...terrain
      });
    }
    newGrid.push(currentRow);
  }

  const newAgentPos = getRandomEmptyPosition(newGrid);
  const newFoodPos = getRandomEmptyPosition(newGrid, [newAgentPos]);

  return {
    newGrid,
    newAgentPos,
    newFoodPos,
  };
}