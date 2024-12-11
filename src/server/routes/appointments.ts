import { Router } from 'express';
import pool from '../db';

const router = Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        array_agg(as2.service_id) as services
      FROM appointments a
      LEFT JOIN appointment_services as2 ON a.id = as2.appointment_id
      GROUP BY a.id
      ORDER BY a.date
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  const { clientId, date, services, isPaid, notes } = req.body;
  
  try {
    const client = await pool.query('BEGIN');
    
    // Create appointment
    const appointmentResult = await pool.query(
      'INSERT INTO appointments (client_id, date, is_paid, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [clientId, date, isPaid, notes]
    );
    
    const appointmentId = appointmentResult.rows[0].id;
    
    // Add services
    for (const serviceId of services) {
      await pool.query(
        'INSERT INTO appointment_services (appointment_id, service_id) VALUES ($1, $2)',
        [appointmentId, serviceId]
      );
    }
    
    await pool.query('COMMIT');
    
    res.status(201).json({
      ...appointmentResult.rows[0],
      services
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment payment status
router.patch('/:id/payment', async (req, res) => {
  const { isPaid } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET is_paid = $1 WHERE id = $2 RETURNING *',
      [isPaid, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Update appointment notes
router.patch('/:id/notes', async (req, res) => {
  const { notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET notes = $1 WHERE id = $2 RETURNING *',
      [notes, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
