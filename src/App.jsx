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

const GRID_ROWS = 28;
const GRID_COLS = 40;

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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A*');

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [gameState, setGameState] = useState('idle');

  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [terrainCosts, setTerrainCosts] = useState({
    sand: 1,
    mud: 10,
    water: 30,
  });

  const handleReset = useCallback(() => {
    const { newGrid, newAgentPos, newFoodPos } = generateRandomMap(GRID_ROWS, GRID_COLS, terrainCosts);
    setGrid(newGrid);
    setAgentPos(newAgentPos);
    setFoodPos(newFoodPos);
    setPath([]);
    setVisitedNodes([]);
    setGameState('idle');
  }, [terrainCosts]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const animateSearch = (visitedNodesInOrder, finalPath) => {
    if (!visitedNodesInOrder || visitedNodesInOrder.length === 0) {
      setGameState('finished');
      if (finalPath.length > 0) animatePath(finalPath);
      return;
    }
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        setVisitedNodes(prev => [...prev, visitedNodesInOrder[i]]);
        if (i === visitedNodesInOrder.length - 1) {
          if (finalPath.length > 0) animatePath(finalPath);
          else setGameState('finished');
        }
      }, animationSpeed * (i + 1));
    }
  };

  const animatePath = (finalPath) => {
    setGameState('animatingPath');
    setPath(finalPath);
    setTimeout(() => {
      setGameState('finished');
    }, animationSpeed * finalPath.length * 2);
  };

  const handleStartSearch = () => {
    if (gameState === 'searching' || gameState === 'animatingPath') return;
    setGameState('searching');
    setVisitedNodes([]);
    setPath([]);

    if (grid.length > 0 && agentPos && foodPos) {
      const newGrid = grid.map(row => row.map(node => ({ ...node })));
      resetGridSearchProperties(newGrid);

      const startNode = newGrid[agentPos.row][agentPos.col];
      const goalNode = newGrid[foodPos.row][foodPos.col];
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
      animateSearch(searchResult.visitedNodesInOrder, searchResult.path);
    } else {
      setGameState('idle');
    }
  };

  const handleCostChange = (terrain, newCost) => {
    setTerrainCosts(prevCosts => ({
      ...prevCosts,
      [terrain]: newCost
    }));
  };

  return (
    <div className="app">
      <MainPanel
        onStart={handleStartSearch}
        onReset={handleReset}
        onAlgoChange={setSelectedAlgorithm}
        selectedAlgorithm={selectedAlgorithm}
        gameState={gameState}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        // As props que estavam faltando foram adicionadas de volta:
        terrainCosts={terrainCosts}
        onCostChange={handleCostChange}
      />
      <div className="right-panel">
        <Grid
          grid={grid}
          agentPos={agentPos}
          foodPos={foodPos}
          path={path}
          visitedNodes={visitedNodes}
        />
      </div>
    </div>
  );
}

export default App;