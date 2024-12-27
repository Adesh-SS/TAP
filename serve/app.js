//import: Dependencies

import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';

//Routes

import auth from './routes/auth.js';
import batch from './routes/batch.js';
import department from './routes/department.js';
import mentor from './routes/mentors.js';
import student from './routes/students.js';
import onduty from './routes/onduty.js';

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api/auth', auth);
app.use('/batch', batch);
app.use('/department', department);
app.use('/mentor', mentor);
app.use('/student', student);
app.use('/onduty', onduty);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;