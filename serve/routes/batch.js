//import: Dependencies

import express from 'express';

//import: Models

import { Batch, validateBatch } from '../models/batches/addBatches.js';
import { Admin } from '../models/for_login/admin.js';

const router = express.Router();

//Route: Add Branch

router.post('/addBatch', async (req, res) => {
    try {
        const { error } = validateBatch(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const existingBatch = await Batch.findOne({ name: req.body.name });
        if (existingBatch) return res.status(400).send('Batch with this name already exists');

        const [startYear, endYear] = req.body.name.split('-').map(year => parseInt(year, 10));
        if(endYear - startYear !== 4) return res.status(400).send('Batch should be of 4 years');

        const branch = new Batch({
            name: req.body.name
        });

        await branch.save();

        const admin = await Admin.findOne();
        if (!admin) return res.status(404).send('Admin not found');

        admin.batches.push(branch._id);
        await admin.save();

        res.status(200).send('Batch added successfully');

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;