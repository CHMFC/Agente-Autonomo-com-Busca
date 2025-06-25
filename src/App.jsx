import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid/Grid';
import MainPanel from './pages/MainPanel/MainPanel';
import { generateRandomMap } from './utils/mapGenerator';
import { aStarSearch } from './algorithms/aStar';
import { bfsSearch } from './algorithms/bfs';
import { dfsSearch } from './algorithms/dfs';
import { greedySearch } from './algorithms/greedy';
import { uniformCostSearch } from './algorithms/uniformCost';
import './App.css';

// Esta função auxiliar limpa os dados da busca anterior do grid.
const resetGridSearchProperties = (grid) => {
  for (const row of grid) {
    for (const node of row) {
      node.gScore = Infinity;
      node.fScore = Infinity;
      node.hScore = Infinity;
      node.previousNode = null;
    }
  }
};

function App() {
  const [grid, setGrid] = useState([]);
  const [agentPos, setAgentPos] = useState(null);
  const [foodPos, setFoodPos] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [gameState, setGameState] = useState('idle'); // idle, searching, animatingPath, done
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A*');
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const { map, agent, food } = generateRandomMap(20, 40, 0.2);
    setGrid(map);
    setAgentPos(agent);
    setFoodPos(food);
  }, []);

  const handleGenerateMap = () => {
    const { map, agent, food } = generateRandomMap(20, 40, 0.2);
    setGrid(map);
    setAgentPos(agent);
    setFoodPos(food);
    setVisitedNodes([]);
    setPath([]);
    setGameState('idle');
  };

  const animateSearch = (visited, finalPath) => {
    for (let i = 0; i <= visited.length; i++) {
      if (i === visited.length) {
        setTimeout(() => {
          animatePath(finalPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visited[i];
        // Atualiza o grid para refletir o gScore do nó visitado
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            const gridNode = newGrid[node.row][node.col];
            if (gridNode) {
                gridNode.gScore = node.gScore;
            }
            return newGrid;
        });
        setVisitedNodes(prev => [...prev, node]);
      }, 10 * i);
    }
  };

  const animatePath = (finalPath) => {
    setGameState('animatingPath');
    for (let i = 0; i < finalPath.length; i++) {
      setTimeout(() => {
        setPath(prev => [...prev, finalPath[i]]);
        if (i === finalPath.length - 1) {
          setGameState('done');
        }
      }, 50 * i);
    }
  };

  const handleStartSearch = () => {
    if (gameState === 'searching' || gameState === 'animatingPath') return;
    setGameState('searching');
    setVisitedNodes([]);
    setPath([]);

    if (grid.length > 0 && agentPos && foodPos) {
      // Cria uma cópia profunda para não mutar o estado diretamente
      const newGrid = grid.map(row => row.map(node => ({ ...node })));
      // Reseta as propriedades de busca do grid
      resetGridSearchProperties(newGrid);

      const startNode = newGrid[agentPos.row][agentPos.col];
      const goalNode = newGrid[foodPos.row][foodPos.col];
      // O custo para chegar ao nó inicial é sempre 0
      startNode.gScore = 0;

      let searchResult;
      switch (selectedAlgorithm) {
        case 'BFS':
          searchResult = bfsSearch(newGrid, startNode, goalNode);
          break;
        case 'DFS':
          searchResult = dfsSearch(newGrid, startNode, goalNode);
          break;
        case 'Greedy':
          searchResult = greedySearch(newGrid, startNode, goalNode);
          break;
        case 'UniformCost':
          searchResult = uniformCostSearch(newGrid, startNode, goalNode);
          break;
        case 'A*':
        default:
          searchResult = aStarSearch(newGrid, startNode, goalNode);
          break;
      }
      // Passamos os nós com os dados da busca (incluindo gScore) para a animação
      animateSearch(searchResult.visitedNodesInOrder, searchResult.path);
    } else {
      setGameState('idle');
    }
  };

  const handleMouseDown = (row, col) => {
    if (gameState !== 'idle') return;
    setIsMouseDown(true);
    toggleObstacle(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!isMouseDown) return;
    toggleObstacle(row, col);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const toggleObstacle = (row, col) => {
    const newGrid = grid.map((r, rowIndex) =>
      r.map((node, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (!node.isAgent && !node.isFood) {
            return { ...node, isObstacle: !node.isObstacle };
          }
        }
        return node;
      })
    );
    setGrid(newGrid);
  };

  return (
    <div className="App">
      <MainPanel
        onGenerateMap={handleGenerateMap}
        onStartSearch={handleStartSearch}
        onAlgoChange={setSelectedAlgorithm}
        selectedAlgorithm={selectedAlgorithm}
        isSearching={gameState === 'searching' || gameState === 'animatingPath'}
      />
      <Grid
        grid={grid}
        visitedNodes={visitedNodes}
        path={path}
        agentPos={agentPos}
        foodPos={foodPos}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default App;