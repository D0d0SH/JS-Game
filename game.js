import { COLORS, LEVELS } from './constants.js';
import { gameState } from './gameState.js';

export function getRandomColor(maxColors) {
    return COLORS[Math.floor(Math.random() * maxColors)];
}

export function createBoard() {
    const level = LEVELS[gameState.currentLevel];
    const size = level.size;
    gameState.board = [];
    for (let i = 0; i < size; i++) {
        gameState.board[i] = [];
        for (let j = 0; j < size; j++) {
            gameState.board[i][j] = { color: getRandomColor(level.colors), matched: false };
        }
    }
}

export function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) {
        console.error('Элемент с id "game-board" не найден!');
        return;
    }

    gameBoard.innerHTML = ''; // Очищаем доску
    gameBoard.style.gridTemplateColumns = `repeat(${LEVELS[gameState.currentLevel].size}, 50px)`;
    gameBoard.style.gridTemplateRows = `repeat(${LEVELS[gameState.currentLevel].size}, 50px)`;

    for (let i = 0; i < LEVELS[gameState.currentLevel].size; i++) {
        for (let j = 0; j < LEVELS[gameState.currentLevel].size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.backgroundColor = gameState.board[i][j].color;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
    gameBoard.style.animation = 'levelTransition 0.5s ease';
}

export function handleCellClick(event) {
    if (gameState.isProcessing || gameState.isPaused) return;
    gameState.isProcessing = true;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    checkMatches(row, col);
    removeMatches();
    fillEmptyCells();
    renderBoard();
    updateScore();

    setTimeout(() => {
        gameState.isProcessing = false;
        checkForPossibleMatches();
        checkForLevelCompletion();
    }, 500);
}

export function checkMatches(row, col) {
    const color = gameState.board[row][col].color;
    let matches = [];

    // Check horizontal matches
    for (let i = 0; i < LEVELS[gameState.currentLevel].size; i++) {
        if (gameState.board[row][i].color === color) {
            matches.push({ row, col: i });
        } else {
            if (matches.length >= 3) break;
            matches = [];
        }
    }

    // Check vertical matches
    if (matches.length < 3) {
        matches = [];
        for (let i = 0; i < LEVELS[gameState.currentLevel].size; i++) {
            if (gameState.board[i][col].color === color) {
                matches.push({ row: i, col });
            } else {
                if (matches.length >= 3) break;
                matches = [];
            }
        }
    }

    if (matches.length >= 3) {
        matches.forEach(match => {
            gameState.board[match.row][match.col].matched = true;
        });
        gameState.score += matches.length * 10;
    }
}

export function removeMatches() {
    for (let i = 0; i < LEVELS[gameState.currentLevel].size; i++) {
        for (let j = 0; j < LEVELS[gameState.currentLevel].size; j++) {
            if (gameState.board[i][j].matched) {
                gameState.board[i][j] = { color: '', matched: false };
            }
        }
    }
}

export function fillEmptyCells() {
    for (let j = 0; j < LEVELS[gameState.currentLevel].size; j++) {
        let emptyRow = LEVELS[gameState.currentLevel].size - 1;
        for (let i = LEVELS[gameState.currentLevel].size - 1; i >= 0; i--) {
            if (gameState.board[i][j].color === '') {
                while (emptyRow >= 0 && gameState.board[emptyRow][j].color === '') {
                    emptyRow--;
                }
                if (emptyRow >= 0) {
                    gameState.board[i][j] = { color: gameState.board[emptyRow][j].color, matched: false };
                    gameState.board[emptyRow][j] = { color: '', matched: false };
                } else {
                    gameState.board[i][j] = { color: getRandomColor(LEVELS[gameState.currentLevel].colors), matched: false };
                }
            }
        }
    }
}

export function checkForPossibleMatches() {
    let hasMatches = false;
    for (let i = 0; i < LEVELS[gameState.currentLevel].size; i++) {
        for (let j = 0; j < LEVELS[gameState.currentLevel].size; j++) {
            const color = gameState.board[i][j].color;
            // Check horizontal
            if (j + 2 < LEVELS[gameState.currentLevel].size && gameState.board[i][j + 1].color === color && gameState.board[i][j + 2].color === color) {
                hasMatches = true;
            }
            // Check vertical
            if (i + 2 < LEVELS[gameState.currentLevel].size && gameState.board[i + 1][j].color === color && gameState.board[i + 2][j].color === color) {
                hasMatches = true;
            }
        }
    }

    if (!hasMatches) {
        showMessage('Нет возможных совпадений!');
        createBoard();
        renderBoard();
    }
}

export function updateScore() {
    document.getElementById('score').textContent = `Очки: ${gameState.score}`;
}

export function startTimer() {
    gameState.timeLeft = LEVELS[gameState.currentLevel].time;
    document.getElementById('timer').textContent = `Время: ${gameState.timeLeft}`;
    gameState.timer = setInterval(() => {
        if (gameState.isPaused) return;
        gameState.timeLeft--;
        document.getElementById('timer').textContent = `Время: ${gameState.timeLeft}`;
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            checkForLevelCompletion();
        }
    }, 1000);
}

export function nextLevel() {
    if (gameState.score >= LEVELS[gameState.currentLevel].goal) {
        gameState.currentLevel++;
        if (gameState.currentLevel < LEVELS.length) {
            document.getElementById('level').textContent = `Уровень: ${gameState.currentLevel + 1}`;
            document.getElementById('goal').textContent = `Цель: ${LEVELS[gameState.currentLevel].goal} очков`;
            gameState.score = 0; // Обнуление счета
            updateScore();
            createBoard();
            renderBoard();
            startTimer();
            showMessage(`Уровень ${gameState.currentLevel + 1} начался!`);
        } else {
            showMessage('Вы прошли все уровни!');
            saveResult(); // Сохраняем результат игрока
        }
    } else {
        showMessage('Вы не набрали достаточно очков. Попробуйте снова.');
        gameState.score = 0; // Обнуление счета
        createBoard();
        renderBoard();
        startTimer();
    }
}

export function checkForLevelCompletion() {
    if (gameState.timeLeft <= 0) {
        if (gameState.score >= LEVELS[gameState.currentLevel].goal) {
            showMessage(`Уровень ${gameState.currentLevel + 1} пройден! Переходим на следующий уровень.`);
            saveResult(); // Сохраняем результат игрока
            nextLevel();
        } else {
            showMessage('Время вышло! Вы не набрали достаточно очков. Попробуйте снова.');
            gameState.score = 0; // Обнуление счета
            createBoard();
            renderBoard();
            startTimer();
        }
    }
}

export function showMessage(text) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000); // время показа сообщения
}