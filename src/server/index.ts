import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db';
import clientsRouter from './routes/clients';
import servicesRouter from './routes/services';
import appointmentsRouter from './routes/appointments';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize routes
app.use('/api/clients', clientsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/appointments', appointmentsRouter);

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
