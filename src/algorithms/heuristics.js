/**
 * Calcula a Distância de Manhattan entre dois nós.
 * É a soma das distâncias absolutas em x e y. Perfeita para grids onde não se pode mover na diagonal.
 * @param {Object} nodeA - O primeiro nó, com {row, col}.
 * @param {Object} nodeB - O segundo nó, com {row, col}.
 * @returns {number} A distância de Manhattan.
 */
export function manhattanDistance(nodeA, nodeB) {
  const dRow = Math.abs(nodeA.row - nodeB.row);
  const dCol = Math.abs(nodeA.col - nodeB.col);
  return dRow + dCol;
}