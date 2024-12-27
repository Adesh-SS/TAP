//import: Dependencies

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from 'crypto';

//import: Models

import { Admin, validateAdminLogin } from '../models/for_login/admin.js';
import { Student, validateStudentLogin } from '../models/students/addStudents.js'

const router = express.Router();

dotenv.config();

//Route: User Login

router.post('/login', async (req, res) => {
    try {
        const {error: AdminError} = validateAdminLogin(req.body);

        if(AdminError) {
            const student = await Student.findOne({studentId: req.body.loginId});
            if(!student) return res.status(400).send('Invalid loginId or password');

            const validPassword = await bcrypt.compare(req.body.password, student.studentPassword);
            if(!validPassword) return res.status(400).send('Invalid loginId or password');

            const token = student.generateAuthToken();
            const role = student.role;
            const falseToken = crypto.randomBytes(16).toString('hex');

            res.status(200).json({token: token, role: role, false: falseToken});
        } else {
            const admin = await Admin.findOne({loginId: req.body.loginId});
            if(!admin) return res.status(400).send('Invalid loginId or password');

            const validPassword = await bcrypt.compare(req.body.password, admin.password);
            if(!validPassword) return res.status(400).send('Invalid loginId or password');

            const token = admin.generateAuthToken();
            const role = admin.role;
            const falseToken = crypto.randomBytes(16).toString('hex');

            res.status(200).json({ token: token, role: role, false: falseToken });  
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

//Route: Admin Login

// router.post('/login', async (req, res) => {
//     try {
//         const {error} = validateAdminLogin(req.body);
//         if(error) return res.status(400).send(error.details[0].message);

//         const admin = await Admin.findOne({loginId: req.body.loginId});
//         if(!admin) return res.status(400);

//         const validPassword = await bcrypt.compare(req.body.password, admin.password);
//         if(!validPassword) return res.status(400).send('Invalid loginId or password');

//         const token = admin.generateAuthToken();
//         const role = admin.role;
//         const falseToken = crypto.randomBytes(16).toString('hex');

//         res.status(200).json({ token: token, role: role, false: falseToken });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

export default router;