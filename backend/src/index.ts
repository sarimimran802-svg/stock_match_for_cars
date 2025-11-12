import express from 'express';
import cors from 'cors';
import { orderRouter } from './routes/orders';
import { matchRouter } from './routes/matches';
import { initDatabase } from './database/db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database on startup
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Routes
app.use('/api/orders', orderRouter);
app.use('/api/matches', matchRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock Match API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

