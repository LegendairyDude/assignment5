const pool = require('../models/db');

// Get all categories with their items (using JSON aggregation)
exports.getInventory = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.name,
        COALESCE(json_agg(i.*) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
      GROUP BY c.id
      ORDER BY c.id;
    `;
    const result = await pool.query(query);
    res.render('index', { categories: result.rows });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new category (only requires a name)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new item (only requires a name, quantity, and category_id)
exports.createItem = async (req, res) => {
  try {
    const { name, quantity, category_id } = req.body;
    await pool.query(
      'INSERT INTO items (name, quantity, category_id) VALUES ($1, $2, $3)',
      [name, quantity, category_id]
    );
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Remove a specified quantity from an item (or delete if zero or below)
exports.removeItemQuantity = async (req, res) => {
  try {
    const { itemId, quantityToRemove } = req.body;
    const result = await pool.query("SELECT quantity FROM items WHERE id = $1", [itemId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Item not found");
    }
    const currentQty = result.rows[0].quantity;
    const qtyToRemove = parseInt(quantityToRemove, 10);
    const newQty = currentQty - qtyToRemove;

    if (newQty > 0) {
      await pool.query("UPDATE items SET quantity = $1 WHERE id = $2", [newQty, itemId]);
      console.log(`Updated item ${itemId}: new quantity ${newQty}`);
    } else {
      await pool.query("DELETE FROM items WHERE id = $1", [itemId]);
      console.log(`Deleted item ${itemId} as remaining quantity is ${newQty}`);
    }
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addItemQuantity = async (req, res) => {
  try {
    const { itemId, quantityToAdd } = req.body;
    const result = await pool.query("SELECT quantity FROM items WHERE id = $1", [itemId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Item not found");
    }
    const currentQty = result.rows[0].quantity;
    const qtyToAdd = parseInt(quantityToAdd, 10);
    const newQty = currentQty + qtyToAdd;
    await pool.query("UPDATE items SET quantity = $1 WHERE id = $2", [newQty, itemId]);
    console.log(`Updated item ${itemId}: new quantity ${newQty}`);
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
