import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.ELA_DATABASE_URL) {
  throw new Error('Database connection URL is not defined in environment variables');
}

const pool = new Pool({
  connectionString: process.env.ELA_DATABASE_URL,
  ssl: true
});

// Test the connection
pool.connect()
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error('Error connecting to the database:', err));

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Clients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL
      )
    `);

    // Services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL
      )
    `);

    // Appointments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        date TIMESTAMP NOT NULL,
        is_paid BOOLEAN DEFAULT false,
        notes TEXT,
        CONSTRAINT fk_client
          FOREIGN KEY(client_id)
          REFERENCES clients(id)
          ON DELETE CASCADE
      )
    `);

    // Appointment services junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointment_services (
        appointment_id INTEGER REFERENCES appointments(id),
        service_id INTEGER REFERENCES services(id),
        PRIMARY KEY (appointment_id, service_id),
        CONSTRAINT fk_appointment
          FOREIGN KEY(appointment_id)
          REFERENCES appointments(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_service
          FOREIGN KEY(service_id)
          REFERENCES services(id)
          ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

export default pool;
