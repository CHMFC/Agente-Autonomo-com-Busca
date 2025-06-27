// src/App.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import Grid from "./components/Grid/Grid";
import MainPanel from "./pages/MainPanel/MainPanel";
import { generateRandomMap } from "./utils/mapGenerator";
import { aStarSearch } from "./algorithms/aStar";
import { bfsSearch } from "./algorithms/bfs";
import { dfsSearch } from "./algorithms/dfs";
import { greedySearch } from "./algorithms/greedy";
import { uniformCostSearch } from "./algorithms/uniformCost";
import "./App.css";
import InfoPanel from "./components/InfoPanel/InfoPanel";

const GRID_ROWS = 28;
const GRID_COLS = 40;

const resetGridSearchProperties = (grid) => {
  grid.forEach((row) =>
    row.forEach((node) => {
      node.gScore = Infinity;
      node.fScore = Infinity;
      node.hScore = Infinity;
      node.previousNode = null;
    })
  );
};

function App() {
  const [grid, setGrid] = useState([]);
  const [agentPos, setAgentPos] = useState(null);
  const [initialAgentPos, setInitialAgentPos] = useState(null); // <-- NOVO ESTADO
  const [foodPos, setFoodPos] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("A*");
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [gameState, setGameState] = useState("idle");
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [terrainCosts, setTerrainCosts] = useState({
    sand: 1,
    mud: 10,
    water: 30,
  });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const [totalCost, setTotalCost] = useState(0);
  const [foodsFoundCount, setFoodsFoundCount] = useState(0);
  const [initialFoodPos, setInitialFoodPos] = useState(null);

  const animationStateRef = useRef({
    visitedNodes: [],
    path: [],
    visitedIndex: 0,
    pathIndex: 0,
  });

  const clearAnimation = () => {
    clearTimeout(timeoutRef.current);
  };

  const runAnimation = useCallback(() => {
    if (isPaused) return;

    const { visitedNodes, path } = animationStateRef.current;
    const { visitedIndex, pathIndex } = animationStateRef.current;

    if (visitedIndex < visitedNodes.length) {
      const nodeToAnimate = visitedNodes[visitedIndex];

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
        const gridNode = newGrid[nodeToAnimate.row][nodeToAnimate.col];
        if (gridNode) {
          gridNode.gScore = nodeToAnimate.gScore;
        }
        return newGrid;
      });

      setVisitedNodes((prev) => [...prev, nodeToAnimate]);
      animationStateRef.current.visitedIndex++;
      timeoutRef.current = setTimeout(runAnimation, animationSpeed);
      return;
    }

    if (path.length > 0 && pathIndex < path.length) {
      if (pathIndex === 0) {
        setGameState("animatingPath");
      }
      const currentNodeOnPath = path[pathIndex];
      setPath((prev) => [...prev, currentNodeOnPath]);
      setAgentPos({ row: currentNodeOnPath.row, col: currentNodeOnPath.col });
      animationStateRef.current.pathIndex++;
      timeoutRef.current = setTimeout(runAnimation, 200);
      return;
    }

    if (
      gameState !== "done" &&
      (gameState === "searching" || gameState === "animatingPath")
    ) {
      if (path.length > 0) {
        const finalNode = path[path.length - 1];
        setTotalCost(finalNode.gScore);
        setFoodsFoundCount((prev) => prev + 1);

        setFoodPos(null);
      }
      setGameState("done");
    }
  }, [animationSpeed, isPaused, gameState]);

  useEffect(() => {
    const isAnimating =
      gameState === "searching" || gameState === "animatingPath";
    if (isAnimating && !isPaused) {
      runAnimation();
    } else {
      clearAnimation();
    }
  }, [gameState, isPaused, runAnimation]);

  const handleNewMap = useCallback(() => {
    clearAnimation();
    const { newGrid, newAgentPos, newFoodPos } = generateRandomMap(
      GRID_ROWS,
      GRID_COLS,
      terrainCosts
    );
    setGrid(newGrid);
    setAgentPos(newAgentPos);
    setInitialAgentPos(newAgentPos);
    setInitialFoodPos(newFoodPos);
    setFoodPos(newFoodPos);
    setPath([]);
    setVisitedNodes([]);
    setTotalCost(0);
    setGameState("idle");
    setIsPaused(false);
    animationStateRef.current = {
      visitedNodes: [],
      path: [],
      visitedIndex: 0,
      pathIndex: 0,
    };
  }, [terrainCosts]);

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleResetCounter = () => {
    setFoodsFoundCount(0);
  };

  const handleResetAnimation = useCallback(() => {
    clearAnimation();

    if (gameState === "done" && path.length > 0) {
      setFoodsFoundCount((prev) => Math.max(0, prev - 1));
    }

    setPath([]);
    setVisitedNodes([]);
    setTotalCost(0);

    if (initialAgentPos) {
      setAgentPos(initialAgentPos);
    }

    // Adicione este bloco para restaurar a comida
    if (initialFoodPos) {
      setFoodPos(initialFoodPos);
    }

    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    resetGridSearchProperties(newGrid);
    setGrid(newGrid);
    setGameState("idle");
    setIsPaused(false);
    animationStateRef.current = {
      visitedNodes: [],
      path: [],
      visitedIndex: 0,
      pathIndex: 0,
    };
  }, [grid, gameState, path, initialAgentPos, initialFoodPos]); 

  useEffect(() => {
    handleNewMap();
  }, [handleNewMap]);

  const handleStartSearch = () => {
    if (gameState !== "idle") return;

    handleResetAnimation();
    setIsPaused(false);

    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    resetGridSearchProperties(newGrid);
    const startNode = newGrid[agentPos.row][agentPos.col];
    const goalNode = newGrid[foodPos.row][foodPos.col];
    startNode.gScore = 0;

    let searchResult;
    switch (selectedAlgorithm) {
      case "BFS":
        searchResult = bfsSearch(newGrid, startNode, goalNode);
        break;
      case "DFS":
        searchResult = dfsSearch(newGrid, startNode, goalNode);
        break;
      case "Greedy":
        searchResult = greedySearch(newGrid, startNode, goalNode);
        break;
      case "UniformCost":
        searchResult = uniformCostSearch(newGrid, startNode, goalNode);
        break;
      default:
        searchResult = aStarSearch(newGrid, startNode, goalNode);
        break;
    }

    animationStateRef.current = {
      visitedNodes: searchResult.visitedNodesInOrder,
      path: searchResult.path,
      visitedIndex: 0,
      pathIndex: 0,
    };

    setGameState("searching");
  };

  const handleCostChange = (terrain, newCost) => {
    setTerrainCosts((prev) => ({ ...prev, [terrain]: newCost }));
  };

  const toggleWall = (row, col) => {
    if (
      (agentPos.row === row && agentPos.col === col) ||
      (foodPos.row === row && foodPos.col === col)
    )
      return;
    const newGrid = grid.map((r) => r.slice());
    const node = newGrid[row][col];
    const newNode = { ...node, isObstacle: !node.isObstacle };
    newGrid[row][col] = newNode;
    setGrid(newGrid);
  };

  const handleMouseDown = (row, col) => {
    if (gameState !== "idle") return;
    toggleWall(row, col);
    setIsMouseDown(true);
  };

  const handleMouseEnter = (row, col) => {
    if (gameState !== "idle" || !isMouseDown) return;
    toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const canPause = gameState === "searching" || gameState === "animatingPath";
  const canReset = canPause || gameState === "done";

  return (
    <div className="app">
      <MainPanel
        onStart={handleStartSearch}
        onReset={handleNewMap}
        onAlgoChange={setSelectedAlgorithm}
        selectedAlgorithm={selectedAlgorithm}
        gameState={gameState}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        terrainCosts={terrainCosts}
        onCostChange={handleCostChange}
      />
      <div className="right-panel">
        <div className="info-panel">
          <InfoPanel
            isPaused={isPaused}
            canPause={canPause}
            canReset={canReset}
            handlePauseResume={handlePauseResume}
            handleReset={handleResetAnimation}
            totalCost={totalCost}
            foodsFound={foodsFoundCount}
            handleResetCounter={handleResetCounter}
          />
        </div>
        <div className="grid-panel">
          <Grid
            grid={grid}
            agentPos={agentPos}
            foodPos={foodPos}
            path={path}
            visitedNodes={visitedNodes}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
