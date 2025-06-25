import { manhattanDistance } from './heuristics.js';

/**
 * Executa o algoritmo de busca Gulosa (Greedy Best-First Search).
 * @param {Array<Array<Object>>} grid - O grid completo do mapa.
 * @param {Object} startNode - O nó inicial {row, col}.
 * @param {Object} goalNode - O nó objetivo {row, col}.
 * @returns {Object} Um objeto contendo { visitedNodesInOrder, path }.
 */
export function greedySearch(grid, startNode, goalNode) {
  const visitedNodesInOrder = [];
  const openSet = [startNode]; // Nossa "fila de prioridade"
  const closedSet = new Set();

  // gScore é o custo do início até o nó atual (calculado para exibição)
  // hScore é o custo heurístico do nó atual até o final
  startNode.hScore = manhattanDistance(startNode, goalNode);
  // gScore do nó inicial é 0, definido no App.jsx

  while (openSet.length > 0) {
    // Ordena o openSet para pegar o nó com o menor hScore (o mais "promissor")
    openSet.sort((a, b) => a.hScore - b.hScore);
    const current = openSet.shift();

    if (closedSet.has(`${current.row}-${current.col}`)) {
      continue;
    }

    visitedNodesInOrder.push(current);
    closedSet.add(`${current.row}-${current.col}`);

    if (current.row === goalNode.row && current.col === goalNode.col) {
      return { visitedNodesInOrder, path: reconstructPath(current) };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.row}-${neighbor.col}`)) {
        continue;
      }

      // Calcula o gScore para o vizinho (para exibição)
      const tentativeGScore = current.gScore + (neighbor.cost || 1);

      // Verificamos se o vizinho já está no openSet
      const existingNeighbor = openSet.find(node => node.row === neighbor.row && node.col === neighbor.col);

      if (!existingNeighbor) {
        neighbor.previousNode = current;
        neighbor.gScore = tentativeGScore;
        neighbor.hScore = manhattanDistance(neighbor, goalNode);
        openSet.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] }; // Caminho não encontrado
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isObstacle);
}

// A mesma função de reconstrução de caminho
function reconstructPath(current) {
  const totalPath = [];
  let temp = current;
  while (temp !== null) {
    totalPath.unshift(temp);
    temp = temp.previousNode;
  }
  return totalPath;
}