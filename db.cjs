const { Client } = require('pg');
const config = require('./config.cjs'); // Подключаем конфигурацию

const client = new Client({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
});

module.exports = {
    connect: async () => {
        try {
            await client.connect();
            console.log('Connected to PostgreSQL');
        } catch (err) {
            console.error('Connection error to PostgreSQL:', err.stack);
        }
    },
    query: async (query, values) => {
        try {
            const result = await client.query(query, values);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
};