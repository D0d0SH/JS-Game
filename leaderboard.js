import { gameState } from './gameState.js';

export function saveResult() {
    const playerName = prompt('Введите ваше имя:');
    if (playerName) {
        const result = { name: playerName, score: gameState.score };
        fetch('http://localhost:3000/save-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        })
        .then(response => response.json())
        .then(data => {
            showMessage('Результат сохранен!');
            loadLeaderboard();
        })
        .catch(error => {
            console.error('Ошибка при сохранении результата:', error);
            showMessage('Ошибка при сохранении результата. Попробуйте снова.');
        });
    }
}

export function loadLeaderboard() {
    fetch('http://localhost:3000/get-leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById('leaderboard-list');
            leaderboardList.innerHTML = ''; // Очищаем список
            data.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.name}</td>
                    <td>${entry.score}</td>
                    <td>${new Date(entry.created_at).toLocaleString()}</td>
                `;
                row.classList.add('fadeInRow'); // Добавляем класс для анимации
                leaderboardList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке таблицы лидеров:', error);
        });
}