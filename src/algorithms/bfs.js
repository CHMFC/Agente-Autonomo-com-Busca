/**
 * Executa o algoritmo de busca em largura (BFS) para encontrar o caminho mais curto em termos de número de passos.
 * @param {Array<Array<Object>>} grid - O grid completo do mapa, com nós pré-processados.
 * @param {Object} startNode - O nó inicial {row, col, gScore: 0}.
 * @param {Object} goalNode - O nó objetivo {row, col}.
 * @returns {Object} Um objeto contendo { visitedNodesInOrder, path }.
 */
export function bfsSearch(grid, startNode, goalNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  // Usamos um Set para verificar rapidamente se um nó já foi enfileirado
  const visited = new Set([`${startNode.row}-${startNode.col}`]);

  // O gScore do startNode já foi definido como 0 no App.jsx

  while (queue.length > 0) {
    const current = queue.shift();
    visitedNodesInOrder.push(current);

    if (current.row === goalNode.row && current.col === goalNode.col) {
      // O caminho é reconstruído a partir do nó final usando a referência 'previousNode'
      return { visitedNodesInOrder, path: reconstructPath(current) };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const neighborId = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        // Guarda a referência ao nó anterior para reconstruir o caminho
        neighbor.previousNode = current;
        // O custo para chegar ao vizinho é o custo do nó atual + 1
        neighbor.gScore = current.gScore + 1;
        queue.push(neighbor);
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

  return neighbors.filter(neighbor => !neighbor.isObstacle && !neighbor.previousNode);
}

// Função para reconstruir o caminho a partir do nó final
function reconstructPath(current) {
  const totalPath = [];
  let temp = current;
  while (temp !== null) {
    totalPath.unshift(temp);
    temp = temp.previousNode;
  }
  return totalPath;
}