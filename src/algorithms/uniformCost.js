/**
 * Executa o algoritmo de busca de Custo Uniforme (Uniform Cost Search).
 * @param {Array<Array<Object>>} grid - O grid completo do mapa.
 * @param {Object} startNode - O nó inicial {row, col}.
 * @param {Object} goalNode - O nó objetivo {row, col}.
 * @returns {Object} Um objeto contendo { visitedNodesInOrder, path }.
 */
export function uniformCostSearch(grid, startNode, goalNode) {
  const visitedNodesInOrder = [];
  const openSet = [startNode]; // Fila de prioridade
  const closedSet = new Set();

  // O gScore do startNode já foi definido como 0 no App.jsx

  while (openSet.length > 0) {
    // Ordena o openSet para pegar o nó com o menor gScore (menor custo acumulado)
    openSet.sort((a, b) => a.gScore - b.gScore);
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

      // O custo para se mover para um vizinho é 1 (pode ser alterado se os terrenos tiverem custos diferentes)
      const tentativeGScore = current.gScore + (neighbor.cost || 1);

      // Verifica se o vizinho já está na fila de prioridade
      const existingNeighbor = openSet.find(node => node.row === neighbor.row && node.col === neighbor.col);

      if (!existingNeighbor) {
        // Se o vizinho não está na fila, adiciona
        neighbor.previousNode = current;
        neighbor.gScore = tentativeGScore;
        openSet.push(neighbor);
      } else if (tentativeGScore < existingNeighbor.gScore) {
        // Se já está na fila, mas encontramos um caminho melhor (mais barato), atualiza
        existingNeighbor.previousNode = current;
        existingNeighbor.gScore = tentativeGScore;
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