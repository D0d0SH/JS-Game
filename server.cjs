const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db.cjs'); // Подключаем модуль для работы с базой данных
const routes = require('./routes.cjs'); // Подключаем маршруты

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к базе данных
db.connect();

// Маршруты
app.use('/', routes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});