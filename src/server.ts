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

// Test database connection, sync models, and start server only if successful
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
    
    // Only sync models after successful connection
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database models synced');
    
    // Only start the server after database is ready
    const PORT: number = parseInt(process.env.PORT || '5000');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Fatal database error:', err);
    process.exit(1); // Exit with error code
  });

export default app;