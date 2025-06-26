import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef(null);
    const animationStateRef = useRef({
        visitedNodes: [],
        path: [],
        visitedIndex: 0,
        pathIndex: 0
    });

    const clearAnimation = () => {
        clearTimeout(timeoutRef.current);
    };

    const runAnimation = useCallback(() => {
        const { visitedNodes, path, visitedIndex, pathIndex } = animationStateRef.current;

        if (visitedIndex < visitedNodes.length) {
            const node = visitedNodes[visitedIndex];
            setGrid(prevGrid => {
                const newGrid = prevGrid.slice();
                const gridNode = newGrid[node.row][node.col];
                if (gridNode) gridNode.gScore = node.gScore;
                return newGrid;
            });
            setVisitedNodes(prev => [...prev, node]);
            animationStateRef.current.visitedIndex++;
            timeoutRef.current = setTimeout(runAnimation, animationSpeed);
            return;
        }

        if (pathIndex < path.length) {
            if (pathIndex === 0) setGameState('animatingPath');
            setPath(prev => [...prev, path[pathIndex]]);
            animationStateRef.current.pathIndex++;
            timeoutRef.current = setTimeout(runAnimation, animationSpeed);
            return;
        }

        setGameState('done');
    }, [animationSpeed]);

    useEffect(() => {
        const isAnimating = gameState === 'searching' || gameState === 'animatingPath';
        if (isAnimating && !isPaused) {
            runAnimation();
        } else {
            clearAnimation();
        }
    }, [gameState, isPaused, runAnimation]);

    const handleNewMap = useCallback(() => {
        clearAnimation();
        const { newGrid, newAgentPos, newFoodPos } = generateRandomMap(GRID_ROWS, GRID_COLS, terrainCosts);
        setGrid(newGrid);
        setAgentPos(newAgentPos);
        setFoodPos(newFoodPos);
        setPath([]);
        setVisitedNodes([]);
        setGameState('idle');
        setIsPaused(false);
    }, [terrainCosts]);

    const handleReset = useCallback(() => {
        clearAnimation();
        setPath([]);
        setVisitedNodes([]);
        const newGrid = grid.map(row => row.map(node => ({ ...node })));
        resetGridSearchProperties(newGrid);
        setGrid(newGrid);
        setGameState('idle');
        setIsPaused(false);
        animationStateRef.current = {
            visitedNodes: [],
            path: [],
            visitedIndex: 0,
            pathIndex: 0,
        };
    }, [grid]);


    useEffect(() => {
        handleNewMap();
    }, [handleNewMap]);
    
    const handleStartSearch = () => {
        if (gameState !== 'idle') return;
        
        setVisitedNodes([]);
        setPath([]);
        setIsPaused(false);

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
        
        animationStateRef.current = {
            visitedNodes: searchResult.visitedNodesInOrder,
            path: searchResult.path,
            visitedIndex: 0,
            pathIndex: 0,
        };
        
        setGameState('searching');
    };

    const handlePauseResume = () => {
        setIsPaused(prev => !prev);
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

    const canPause = gameState === 'searching' || gameState === 'animatingPath';
    const canReset = canPause || gameState === 'done';

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
                <div className="grid-controls">
                    <button onClick={handlePauseResume} disabled={!canPause}>
                        {isPaused ? 'Continuar' : 'Pausar'}
                    </button>
                    <button onClick={handleReset} disabled={!canReset}>
                        Resetar
                    </button>
                </div>
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