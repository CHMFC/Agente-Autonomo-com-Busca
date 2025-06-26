import { manhattanDistance } from './heuristics';

/**
 * Executa o algoritmo de busca A* (A-Estrela).
 * @param {Array<Array<Object>>} grid - O grid completo do mapa.
 * @param {Object} startNode - O nó inicial {row, col}.
 * @param {Object} goalNode - O nó objetivo {row, col}.
 * @returns {Object} Um objeto contendo { visitedNodesInOrder, path }.
 */
export function aStarSearch(grid, startNode, goalNode) {
  const visitedNodesInOrder = [];
  const openSet = [startNode]; // Fila de prioridade
  const closedSet = new Set();

  // gScore é o custo do início até o nó atual
  // hScore é o custo heurístico do nó atual até o final
  // fScore é a soma gScore + hScore
  startNode.hScore = manhattanDistance(startNode, goalNode);
  startNode.fScore = startNode.gScore + startNode.hScore;
  // gScore do nó inicial já foi definido como 0 no App.jsx

  while (openSet.length > 0) {
    // Ordena o openSet para pegar o nó com o menor fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
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

      const tentativeGScore = current.gScore + (neighbor.cost || 1);

      // Verifica se o vizinho já está na fila de prioridade
      const existingNeighbor = openSet.find(node => node.row === neighbor.row && node.col === neighbor.col);

      if (!existingNeighbor) {
        // Se o vizinho não está na fila, calcula seus custos e o adiciona
        neighbor.previousNode = current;
        neighbor.gScore = tentativeGScore;
        neighbor.hScore = manhattanDistance(neighbor, goalNode);
        neighbor.fScore = neighbor.gScore + 3*neighbor.hScore;
        openSet.push(neighbor);
      } else if (tentativeGScore < existingNeighbor.gScore) {
        // Se já está na fila, mas encontramos um caminho melhor (mais barato), atualiza seus custos
        existingNeighbor.previousNode = current;
        existingNeighbor.gScore = tentativeGScore;
        existingNeighbor.fScore = existingNeighbor.gScore + existingNeighbor.hScore;
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