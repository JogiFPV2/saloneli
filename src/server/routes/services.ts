import { Router } from 'express';
import pool from '../db';

const router = Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Create new service
router.post('/', async (req, res) => {
  const { name, duration, color } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO services (name, duration, color) VALUES ($1, $2, $3) RETURNING *',
      [name, duration, color]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
