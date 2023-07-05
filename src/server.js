const express = require('express');
const app = express();
const { Pool } = require('pg');
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  password: '310597',
  host: 'localhost',
  port: 5432,
  database: 'snakegame',
});

app.use(express.json());

const createGameScoresTable = async () => {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS players (
        id serial PRIMARY KEY,
        name text,
        score integer
      )
    `;
    await client.query(query);
    console.log(
      'Таблицю game_scores успішно створено або вже існує.',
    );
  } finally {
    client.release();
  }
};

createGameScoresTable();

app.post('/snakegame', async (req, res) => {
  const GameScore = req.body.score;
  const PlayerName = req.body.username;
  console.log('Рахунок отримано:', GameScore);
  console.log("Ім'я гравця отримано:", PlayerName);

  const client = await pool.connect();
  try {
    const query =
      'INSERT INTO players (username, score) VALUES ($1, $2)';
    const values = [PlayerName, GameScore];
    await client.query(query, values);
    console.log('Рахунок гравця було успішно додано');
    res.send('Рахунок отримано і додано до БД');
  } catch (error) {
    console.error('Не вдається додати рахунок до БД', error);
    res.status(500).send('Помилка додавання рахунку до БД');
  } finally {
    client.release();
  }
});

app.get('/game_scores', async (req, res) => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM players';
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(
      'Помилка отримання результатів гри з бази даних:',
      error,
    );
    res
      .status(500)
      .send('Помилка отримання результатів гри з бази даних');
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
