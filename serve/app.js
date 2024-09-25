//import: Dependencies

import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

export default app;