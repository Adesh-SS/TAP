//Import: Dependencies

import express from 'express';
import dotenv from 'dotenv';

//Import: Models

import { Onduty, validateOnduty } from '../models/onduties/addOnduty.js';
import { Student } from '../models/students/addStudents.js';
import { Mentor } from '../models/mentors/addMentors.js';

//Router

const router = express.Router();
dotenv.config();

//Routes: Add Onduty

router.post('/addOnduty', async (req, res) => {
    const { error } = validateOnduty(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const onduty = new Onduty({
        studentDetails: req.body.studentDetails,
        mentorId: req.body.mentorId,
        type: req.body.type,
        from: req.body.from,
        to: req.body.to,
        loggerId: req.body.loggerId,
        eventName: req.body.eventName,
        eventDescription: req.body.eventDescription
    });

    await onduty.save();

    res.send(onduty);
});

router.get('/fetchStudent', async (req, res) => {
    const studentId = req.query.studentId;
    if (!studentId) return res.status(400).send('Student ID is required');

    const regex = new RegExp('^' + studentId, 'i');
    const students = await Student.find({ studentId: regex });

    if (students.length === 0) return res.status(400).send('No students found');

    const studentDetails = students.map(student => (
        `${student.studentName}(${student.studentId})(${student.studentEmail})`
    ));

    res.send(studentDetails);
});

router.get('/fetchMentor', async (req, res) => {
    const mentorId = req.query.mentorId;
    if (!mentorId) return res.status(400).send('Mentor ID is required');

    const regex = new RegExp('^' + mentorId, 'i');
    const mentors = await Mentor.find({ mentorId: regex });

    if (mentors.length === 0) return res.status(400).send('No mentors found');

    const mentorDetails = mentors.map(mentor => (
        `${mentor.mentorId}(${mentor.mentorName})`
    ));

    res.send(mentorDetails);
});

export default router;