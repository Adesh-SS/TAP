//import : Dependencies

import express from 'express';

//import: Models

import { Department, validateDepartment } from '../models/department/addDepartments.js';
import { Batch } from '../models/batches/addBatches.js';
import { Student } from '../models/students/addStudents.js';

const router = express.Router();

//route: Add Department

router.post('/addDepartment', async (req, res) => {
    try {
        const { error } = validateDepartment(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const existingDepartment = await Department.findOne({ name: req.body.name, batchName: req.body.batchName });
        if (existingDepartment) return res.status(400).send({ message: 'Department with this name already exists in the same batch' });

        const batch = await Batch.findOne({ name: req.body.batchName });
        if (!batch) return res.status(404).send({ message: 'Batch not found' });

        const department = new Department({
            name: req.body.name,
            batchName: req.body.batchName
        });

        await department.save();

        batch.departments.push(department._id);

        await batch.save();

        res.status(200).send({ message: 'Department added successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

//route: Get All Departments

router.get('/getDepartments/:batchName', async (req, res) => {
    try {
        const batch = await Batch.findOne({ name: req.params.batchName }).populate('departments');
        if (!batch) return res.status(404).send('Batch not found');

        res.status(200).send(batch.departments);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

//route: delete department by name

router.delete('/deleteDepartment/:batchName/:name', async (req, res) => {
    try {
        const { batchName, name } = req.params;

        const department = await Department.findOneAndDelete({ name, batchName });
        if (!department) return res.status(404).send({ message: 'Department not found in the specified batch' });

        const batch = await Batch.findOne({ name: batchName });
        if (!batch) return res.status(404).send({ message: 'Batch not found' });

        batch.departments = batch.departments.filter(dep => dep.toString() !== department._id.toString());

        await batch.save();

        res.status(200).send({ message: 'Department deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

//route: Get students in studentsIds field

router.get('/getStudents/:batchName/:departmentName', async (req, res) => {
    try {
      const { batchName, departmentName } = req.params;
      const department = await Department.findOne({ batchName, name: departmentName });
  
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
  
      const studentsIds = department.studentsIds;
      const students = await Student.find({ _id: { $in: studentsIds } }, 'studentId studentName studentEmail');
  
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

export default router;