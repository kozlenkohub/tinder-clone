import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import matchRoutes from './routes/matchRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5432;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/matches', matchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
