//import: Dependencies

import express from 'express';

//import: Models

import { Batch, validateBatch } from '../models/batches/addBatches.js';

const router = express.Router();

//Route: Add Branch

router.post('/addBatch', async (req, res) => {
    try {
        const {error} = validateBatch(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const branch = new Batch({
            name: req.body.name
        });

        await branch.save();

        res.status(200).send('Branch added successfully');

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;