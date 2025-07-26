import express from 'express';
import catRoutes from './routes/cat.routes';
import imageRoutes from './routes/images.routes';
import authRoutes from './routes/auth.routes'
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/cat', catRoutes);
app.use('/image', imageRoutes);

export default app;
