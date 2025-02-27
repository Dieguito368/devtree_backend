import express from 'express';
import router from './router';
import 'dotenv/config';
import { connectDB } from './config/db';
import cors from 'cors';
import { corsConfig } from './config/cors';

const app = express();

// Conexión a la BD de MongoDB
connectDB();

// CORS
app.use(cors(corsConfig));

// Leer datos de formularios
app.use(express.json());

// Routing
app.use('/', router);

export default app;