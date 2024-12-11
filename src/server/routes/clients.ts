import { Router } from 'express';
import pool from '../db';

const router = Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY last_name, first_name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clients (first_name, last_name, phone) VALUES ($1, $2, $3) RETURNING *',
      [firstName, lastName, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;
