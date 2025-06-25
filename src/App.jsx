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

const resetGridSearchProperties = (grid) => {
    grid.forEach(row => row.forEach(node => {
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.hScore = Infinity;
        node.previousNode = null;
    }));
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
    const [terrainCosts, setTerrainCosts] = useState({ sand: 1, mud: 10, water: 30 });
    const [isMouseDown, setIsMouseDown] = useState(false);

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
    
    // CORREÇÃO: Lógica de animação que atualiza o grid com os custos
    const animateSearch = (visitedNodesInOrder, finalPath) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                if (i === visitedNodesInOrder.length) {
                    animatePath(finalPath);
                    return;
                }
                const node = visitedNodesInOrder[i];
                // Atualiza o grid para refletir o gScore do nó visitado, o que faz o custo aparecer
                setGrid(prevGrid => {
                    const newGrid = prevGrid.slice();
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
            const newGrid = grid.map(row => row.map(node => ({ ...node })));
            resetGridSearchProperties(newGrid);
            const startNode = newGrid[agentPos.row][agentPos.col];
            const goalNode = newGrid[foodPos.row][foodPos.col];
            startNode.gScore = 0;
            let searchResult;
            switch (selectedAlgorithm) {
                case 'BFS': searchResult = bfsSearch(newGrid, startNode, goalNode); break;
                case 'DFS': searchResult = dfsSearch(newGrid, startNode, goalNode); break;
                case 'Greedy': searchResult = greedySearch(newGrid, startNode, goalNode); break;
                case 'UniformCost': searchResult = uniformCostSearch(newGrid, startNode, goalNode); break;
                default: searchResult = aStarSearch(newGrid, startNode, goalNode); break;
            }
            animateSearch(searchResult.visitedNodesInOrder, searchResult.path);
        } else {
            setGameState('idle');
        }
    };
    
    const handleCostChange = (terrain, newCost) => {
        setTerrainCosts(prev => ({ ...prev, [terrain]: newCost }));
    };

    const toggleWall = (row, col) => {
        if ((agentPos.row === row && agentPos.col === col) || (foodPos.row === row && foodPos.col === col)) return;
        const newGrid = grid.map(r => r.slice());
        const node = newGrid[row][col];
        const newNode = { ...node, isObstacle: !node.isObstacle };
        newGrid[row][col] = newNode;
        setGrid(newGrid);
    };

    const handleMouseDown = (row, col) => {
        if (gameState !== 'idle') return;
        toggleWall(row, col);
        setIsMouseDown(true);
    };

    const handleMouseEnter = (row, col) => {
        if (gameState !== 'idle' || !isMouseDown) return;
        toggleWall(row, col);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
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
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                />
            </div>
        </div>
    );
}

export default App;