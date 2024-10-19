//import: Dependencies

import express from 'express';

//import: Models

import { Student, validateStudent } from '../models/students/addStudents.js';
import { Department } from '../models/department/addDepartments.js';
import { Batch } from '../models/batches/addBatches.js';
import { Mentor } from '../models/mentors/addMentors.js';

//Router

const router = express.Router();

//Routes: Add Students

router.post('/addStudent', async (req, res) => {
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const department = await Department.findOne({name: req.body.department});
    if (!department) return res.status(400).send('Invalid Department');

    const batch = await Batch.findOne({name: req.body.batch});
    if (!batch) return res.status(400).send('Invalid Batch');

    const mentor = await Mentor.findOne({mentorId: req.body.mentorId});
    if (!mentor) return res.status(400).send('Invalid Mentor');

    const email = req.body.studentEmail;
    const roll = req.body.studentId;

    const username = email.split('@')[0];
    const idSuffix = roll.slice(-3);

    const password = `${username}@${idSuffix}`;

    const student = new Student({
        studentId: req.body.studentId,
        studentName: req.body.studentName,
        studentEmail: req.body.studentEmail,
        studentPassword: password,
        department: department._id,
        batch: batch._id,
        mentorId: mentor._id
    });

    await student.save();

    mentor.students.push(student._id);
    await mentor.save();

    department.studentsIds.push(student._id);
    await department.save();

    department.studentsCount = department.studentsIds.length;
    await department.save();

    batch.studentsCount += 1;
    await batch.save();

    res.status(200).send('Student added successfully');
});

export default router;