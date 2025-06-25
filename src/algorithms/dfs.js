/**
 * Executa o algoritmo de busca em profundidade (DFS).
 * @param {Array<Array<Object>>} grid - O grid completo do mapa.
 * @param {Object} startNode - O nó inicial {row, col}.
 * @param {Object} goalNode - O nó objetivo {row, col}.
 * @returns {Object} Um objeto contendo { visitedNodesInOrder, path }.
 */
export function dfsSearch(grid, startNode, goalNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];
  // Usamos um Set para verificar rapidamente se um nó já foi visitado
  const visited = new Set();

  // O gScore do startNode já foi definido como 0 no App.jsx

  while (stack.length > 0) {
    const current = stack.pop();
    const currentId = `${current.row}-${current.col}`;

    // Pula se já visitamos este nó
    if (visited.has(currentId)) {
      continue;
    }
    visited.add(currentId);
    visitedNodesInOrder.push(current);

    if (current.row === goalNode.row && current.col === goalNode.col) {
      return { visitedNodesInOrder, path: reconstructPath(current) };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const neighborId = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(neighborId)) {
        // Guarda a referência ao nó anterior
        neighbor.previousNode = current;
        // O "custo" aqui também é o número de passos (profundidade)
        neighbor.gScore = current.gScore + 1;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] }; // Caminho não encontrado
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  // A ordem em que adicionamos os vizinhos afeta o caminho do DFS.
  // Cima, Direita, Baixo, Esquerda é uma ordem comum para explorar.
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);


  return neighbors.filter(neighbor => !neighbor.isObstacle);
}

// A mesma função de reconstrução do BFS
function reconstructPath(current) {
  const totalPath = [];
  let temp = current;
  while (temp !== null) {
    totalPath.unshift(temp);
    temp = temp.previousNode;
  }
  return totalPath;
}