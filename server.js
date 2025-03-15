// server.js
const express = require('express');
const path = require('path');
const pool = require('./models/db');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (e.g., CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import and mount inventory router (all routes start at root "/")
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/', inventoryRoutes);


const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id)
      );
    `);
    console.log('Database tables are ready.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
