//import : Dependencies

import express from 'express';

//import: Models

import { Department, validateDepartment } from '../models/department/addDepartments.js';
import { Batch } from '../models/batches/addBatches.js';

const router = express.Router();

//route: Add Department

router.post('/addDepartment', async (req, res) => {
    try {
        const { error } = validateDepartment(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const existingDepartment = await Department.findOne({ name: req.body.name });
        if (existingDepartment) return res.status(400).send('Department with this name already exists');

        const batch = await Batch.findOne({ name: req.body.batchName });
        if (!batch) return res.status(404).send('Batch not found');

        const department = new Department({
            name: req.body.name,
            batchName: req.body.batchName
        });

        await department.save();

        batch.departments.push(department._id);

        await batch.save();

        res.status(200).send('Department added successfully');

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;