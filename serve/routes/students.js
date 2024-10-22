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

    const batch = await Batch.findOne({ name: req.body.batch });
    if (!batch) return res.status(400).send('Invalid Batch');

    const department = await Department.findOne({ name: req.body.department, batchName: req.body.batch });
    if (!department) return res.status(400).send('Invalid Department');

    const mentor = await Mentor.findOne({ mentorId: req.body.mentorId });
    if (!mentor) return res.status(400).send('Invalid Mentor');

    const existingStudent = await Student.findOne({
        studentId: req.body.studentId,
        department: department._id,
        batch: batch._id
    });

    if (existingStudent) {
        return res.status(400).send('Student with the same ID already exists in this department and batch');
    }

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

    department.studentsCount += 1;
    await department.save();

    batch.studentsCount += 1;
    await batch.save();

    res.status(200).send('Student added successfully');
});

//Routes: Delete Students

router.delete('/deleteStudent/:batch/:department/:studentId', async (req, res) => {
    const batch = await Batch.findOne({ name: req.params.batch });
    if (!batch) return res.status(400).send('Invalid Batch');

    const department = await Department.findOne({ name: req.params.department, batchName: req.params.batch });
    if (!department) return res.status(400).send('Invalid Department');

    const student = await Student.findOne({ studentId: req.params.studentId, department: department._id, batch: batch._id });
    if (!student) return res.status(400).send('Invalid Student');

    const mentor = await Mentor.findOne({ _id: student.mentorId });
    if (!mentor) return res.status(400).send('Invalid Mentor');

    const index = department.studentsIds.indexOf(student._id);
    department.studentsIds.splice(index, 1);
    await department.save();

    mentor.students.splice(mentor.students.indexOf(student._id), 1);
    await mentor.save();

    department.studentsCount -= 1;
    await department.save();

    batch.studentsCount -= 1;
    await batch.save();

    await Student.deleteOne({ studentId: req.params.studentId });

    res.status(200).send('Student deleted successfully');

});

export default router;