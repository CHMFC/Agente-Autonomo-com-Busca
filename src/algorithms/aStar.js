import { manhattanDistance } from './heuristics.js';

/**
 * Executa o algoritmo de busca A* para encontrar o caminho mais curto.
 * @param {Array<Array<Object>>} grid - O grid completo do mapa.
 * @param {Object} startNode - O nó inicial {row, col}.
 * @param {Object} goalNode - O nó objetivo {row, col}.
 * @returns {Object} Um objeto contendo { visitedNodesInOrder, path }.
 */
export function aStarSearch(grid, startNode, goalNode) {
  const visitedNodesInOrder = [];
  const openSet = [startNode]; // Nós a serem avaliados
  const cameFrom = {}; // Para reconstruir o caminho

  // gScore: Custo do início até o nó atual
  const gScore = new Map();
  grid.forEach(row => row.forEach(node => gScore.set(`${node.row}-${node.col}`, Infinity)));
  gScore.set(`${startNode.row}-${startNode.col}`, 0);

  // fScore: Custo total estimado (gScore + heurística)
  const fScore = new Map();
  grid.forEach(row => row.forEach(node => fScore.set(`${node.row}-${node.col}`, Infinity)));
  fScore.set(`${startNode.row}-${startNode.col}`, manhattanDistance(startNode, goalNode));

  while (openSet.length > 0) {
    // Encontra o nó no openSet com o menor fScore
    openSet.sort((a, b) => fScore.get(`${a.row}-${a.col}`) - fScore.get(`${b.row}-${b.col}`));
    const current = openSet.shift(); // Pega o melhor nó atual

    visitedNodesInOrder.push(current);

    // Se alcançamos o objetivo, reconstruímos e retornamos o caminho
    if (current.row === goalNode.row && current.col === goalNode.col) {
      return { visitedNodesInOrder, path: reconstructPath(cameFrom, current) };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      // O custo para ir de 'current' para 'neighbor' é o custo do terreno do vizinho
      const tentativeGScore = gScore.get(`${current.row}-${current.col}`) + neighbor.cost;

      if (tentativeGScore < gScore.get(`${neighbor.row}-${neighbor.col}`)) {
        // Este é um caminho melhor para o vizinho. Registramos!
        cameFrom[`${neighbor.row}-${neighbor.col}`] = current;
        gScore.set(`${neighbor.row}-${neighbor.col}`, tentativeGScore);
        fScore.set(`${neighbor.row}-${neighbor.col}`, tentativeGScore + manhattanDistance(neighbor, goalNode));
        
        // Se o vizinho não está na lista para ser avaliado, adicionamos ele
        if (!openSet.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // Se o loop terminar, não há caminho
  return { visitedNodesInOrder, path: [] };
}

/**
 * Pega os vizinhos válidos (não-obstáculos) de um nó.
 */
function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  // Cima, Baixo, Esquerda, Direita
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isObstacle);
}

/**
 * Reconstrói o caminho final a partir do mapa `cameFrom`.
 */
function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  let currentKey = `${current.row}-${current.col}`;
  while (cameFrom[currentKey]) {
    current = cameFrom[currentKey];
    totalPath.unshift(current); // Adiciona no início do array
    currentKey = `${current.row}-${current.col}`;
  }
  return totalPath;
}