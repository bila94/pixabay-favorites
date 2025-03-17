import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/auth';
import searchRoutes from './routes/search';
import favoriteRoutes from './routes/favorites';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static('frontend'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoriteRoutes);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connection established successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Sync database models
sequelize.sync({ alter: true })
  .then(() => console.log('Database models synced'))
  .catch(err => console.error('Error syncing database models:', err));

// Start server
const PORT: number = parseInt(process.env.PORT || '5000');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;