//import: Dependencies

import express from 'express';

//import: Models

import { Mentor, validateMentor } from '../models/mentors/addMentors.js';
import { Admin } from '../models/for_login/admin.js';

const router = express.Router();

//Routes

router.post('/addMentor', async (req, res) => {
    const { error } = validateMentor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existingMentor = await Mentor.findOne({ mentorId: req.body.mentorId });
    if (existingMentor) return res.status(400).send('Mentor with this ID already exists');

    const admin = await Admin.findOne();
    if (!admin) return res.status(404).send('Admin not found');

    const mentor = new Mentor({
        mentorId: req.body.mentorId,
        mentorName: req.body.mentorName,
        mentorEmail: req.body.mentorEmail
    });

    try {
        await mentor.save();

        admin.mentors.push(mentor._id);
        await admin.save();

        res.status(200).send("Addition Successful");
    } catch (err){
        res.status(500).send("Server Error");
    }
});

router.get('/getMentors', async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.status(200).send(mentors);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;