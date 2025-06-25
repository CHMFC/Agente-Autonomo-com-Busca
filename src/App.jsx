// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid/Grid';
import MainPanel from './pages/MainPanel/MainPanel';
import { generateRandomMap } from './utils/mapGenerator';
import { aStarSearch } from './algorithms/aStar';
import './App.css';

const GRID_ROWS = 28;
const GRID_COLS = 40;

function App() {
  const [grid, setGrid] = useState([]);
  const [agentPos, setAgentPos] = useState(null);
  const [foodPos, setFoodPos] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A*');
  
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [gameState, setGameState] = useState('idle'); 

  // --- O ESTADO DA VELOCIDADE VIVE AQUI ---
  // Valor inicial de 25ms por passo.
  const [animationSpeed, setAnimationSpeed] = useState(25);

  const handleReset = useCallback(() => {
    const { newGrid, newAgentPos, newFoodPos } = generateRandomMap(GRID_ROWS, GRID_COLS);
    setGrid(newGrid);
    setAgentPos(newAgentPos);
    setFoodPos(newFoodPos);
    setPath([]);
    setVisitedNodes([]);
    setGameState('idle');
  }, []);

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
        // A animação agora usa o estado `animationSpeed`
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
    // A animação agora usa o estado `animationSpeed`
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
      const searchResult = aStarSearch(grid, agentPos, foodPos);
      animateSearch(searchResult.visitedNodesInOrder, searchResult.path);
    } else {
      setGameState('idle');
    }
  };

  return (
    <div className="app">
      <MainPanel 
        onStart={handleStartSearch}
        onReset={handleReset}
        onAlgoChange={setSelectedAlgorithm}
        selectedAlgorithm={selectedAlgorithm}
        gameState={gameState}
        // --- PASSANDO AS PROPS DE VELOCIDADE PARA O PAINEL ---
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
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