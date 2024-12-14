const express = require('express');
const db = require('./db.cjs'); // Подключаем модуль для работы с базой данных

const router = express.Router();

// Маршрут для сохранения результата
router.post('/save-result', async (req, res) => {
    const { name, score } = req.body;
    if (!name || !score) {
        return res.status(400).json({ message: 'Name and score are required' });
    }

    try {
        const query = 'INSERT INTO results (name, score) VALUES ($1, $2)';
        await db.query(query, [name, score]);
        res.status(201).json({ message: 'Result saved successfully' });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ message: 'Error saving result' });
    }
});

// Маршрут для получения таблицы лидеров
router.get('/get-leaderboard', async (req, res) => {
    try {
        const query = 'SELECT name, score, created_at FROM results ORDER BY score DESC LIMIT 10';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

module.exports = router;