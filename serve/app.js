//import: Dependencies

import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';

//Routes

import auth from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;