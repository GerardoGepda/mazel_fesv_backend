import express from "express";
import db from './models/index.cjs';
import routes from './routes/index.js';
import cors from 'cors';

await db.sequelize.sync({ alter: true });

const app = express();

// Cors for connection to frontend 
app.use(cors());

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message: "Something went wrong"});
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});