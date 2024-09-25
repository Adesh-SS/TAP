//import: Dependencies

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

//import: Models

import { Admin, validateAdmin } from '../models/for_login/admin.js';

const router = express.Router();

dotenv.config();

//Route for admin login

router.post('/loginAdmin', async (req, res) => {
    const { error } = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let admin = await Admin.findOne({ loginId: req.body.loginId });
    if (!admin) return res.status(400).send('Invalid Login ID or Password');
    
    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(400).send('Invalid Login ID or Password');
    
    if (admin.firstLogin) {
        admin.firstLogin = false;
        admin.role = 'admin';
        admin.batches = [];
        admin.mentors = [];
        admin.pic = [];
        await admin.save();
    }
    
    const token = admin.generateAuthToken();
    res.send(token);
});

export default router;