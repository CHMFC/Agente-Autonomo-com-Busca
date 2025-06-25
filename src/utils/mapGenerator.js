// src/utils/mapGenerator.js

/**
 * Define as propriedades de cada tipo de terreno.
 * Usar um objeto de constantes torna o código mais limpo e fácil de modificar.
 * `cost: Infinity` é uma forma padrão de representar um obstáculo em algoritmos de busca.
 */
const TERRAIN_DEFAULTS = {
  OBSTACLE: { type: 'obstacle', cost: Infinity, isObstacle: true },
  SAND:     { type: 'sand',     isObstacle: false }, 
  MUD:      { type: 'mud',      isObstacle: false }, // Atoleiro
  WATER:    { type: 'water',    isObstacle: false },
};

/**
 * Encontra uma posição aleatória (linha, coluna) no grid que não seja um obstáculo.
 * @param {Array<Array<Object>>} grid - O grid 2D do mapa.
 * @param {Array<Object>} excludedPositions - Uma lista de posições a serem evitadas (ex: a posição do agente).
 * @returns {Object} Um objeto com as propriedades { row, col }.
 */
const getRandomEmptyPosition = (grid, excludedPositions = []) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let position = null;

  while (position === null) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Verifica se a posição NÃO é um obstáculo
    if (!grid[r][c].isObstacle) {
      // Verifica se a posição NÃO está na lista de posições excluídas
      const isExcluded = excludedPositions.some(p => p.row === r && p.col === c);
      if (!isExcluded) {
        position = { row: r, col: c };
      }
    }
  }
  return position;
};

/**
 * A função principal que gera o mapa aleatório completo.
 * @param {number} rows - O número de linhas do grid.
 * @param {number} cols - O número de colunas do grid.
 * @param {object} terrainCosts - Um objeto com os custos de cada terreno.
 * @returns {Object} Um objeto contendo o novo grid e as posições do agente e da comida.
 */
export function generateRandomMap(rows, cols, terrainCosts) {
  const newGrid = [];

  const TERRAIN_TYPES = {
    OBSTACLE: { ...TERRAIN_DEFAULTS.OBSTACLE },
    SAND:     { ...TERRAIN_DEFAULTS.SAND, cost: terrainCosts.sand },
    MUD:      { ...TERRAIN_DEFAULTS.MUD, cost: terrainCosts.mud },
    WATER:    { ...TERRAIN_DEFAULTS.WATER, cost: terrainCosts.water },
  };

  // Passo 1: Gerar o terreno para cada célula do grid
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      const randomValue = Math.random();
      let terrain;

      // Define a probabilidade de cada tipo de terreno aparecer
      if (randomValue < 0.25) { // 25% de chance de ser um obstáculo
        terrain = TERRAIN_TYPES.OBSTACLE;
      } else if (randomValue < 0.70) { // 45% de chance de ser areia
        terrain = TERRAIN_TYPES.SAND;
      } else if (randomValue < 0.90) { // 20% de chance de ser atoleiro
        terrain = TERRAIN_TYPES.MUD;
      } else { // 10% de chance de ser água
        terrain = TERRAIN_TYPES.WATER;
      }
      
      // Adiciona a célula com suas coordenadas e tipo de terreno
      currentRow.push({
        row,
        col,
        ...terrain
      });
    }
    newGrid.push(currentRow);
  }

  // Passo 2: Encontrar posições válidas para o agente e a comida
  const newAgentPos = getRandomEmptyPosition(newGrid);
  const newFoodPos = getRandomEmptyPosition(newGrid, [newAgentPos]); // Garante que a comida não apareça no mesmo lugar do agente

  return {
    newGrid,
    newAgentPos,
    newFoodPos,
  };
}