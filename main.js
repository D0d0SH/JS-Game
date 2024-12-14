import { createBoard, renderBoard, startTimer, updateScore, showMessage, handleCellClick } from './game.js';
import { saveResult, loadLeaderboard } from './leaderboard.js';
import { gameState } from './gameState.js';
import { LEVELS } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    renderBoard();

    document.getElementById('start-button').addEventListener('click', () => {
        if (gameState.isPaused) {
            gameState.isPaused = false;
            startTimer();
        } else {
            createBoard();
            renderBoard();
            startTimer();
        }
    });

    document.getElementById('pause-button').addEventListener('click', () => {
        gameState.isPaused = true;
        clearInterval(gameState.timer);
        showMessage('Игра приостановлена.');
    });

    document.getElementById('restart-button').addEventListener('click', () => {
        gameState.score = 0;
        updateScore();
        createBoard();
        renderBoard();
        startTimer();
        showMessage('Уровень перезапущен.');
    });

    document.getElementById('leaderboard-button').addEventListener('click', () => {
        saveGameState(); // Сохраняем состояние игры
        window.location.href = 'leaderboard.html';
    });

    loadLeaderboard();
});

function saveGameState() {
    const gameStateToSave = {
        currentLevel: gameState.currentLevel,
        score: gameState.score,
        timeLeft: gameState.timeLeft,
        board: gameState.board
    };
    localStorage.setItem('gameState', JSON.stringify(gameStateToSave));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameStateToLoad = JSON.parse(savedState);
        gameState.currentLevel = gameStateToLoad.currentLevel;
        gameState.score = gameStateToLoad.score;
        gameState.timeLeft = gameStateToLoad.timeLeft;
        gameState.board = gameStateToLoad.board;
        renderBoard();
        updateScore();
        document.getElementById('level').textContent = `Уровень: ${gameState.currentLevel + 1}`;
        document.getElementById('goal').textContent = `Цель: ${LEVELS[gameState.currentLevel].goal} очков`;
    } else {
        createBoard();
        renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadGameState(); // Восстанавливаем состояние игры
    loadLeaderboard();
});