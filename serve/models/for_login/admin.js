import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

dotenv.config();

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        default: 'Student Affairs'
    },
    loginId: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    role: {
        type: String,
        required: true,
        default: 'Admin'
    },
    batches: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
        default: []
    },
    mentors: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }],
        default: []
    },
    pic: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PIC' }],
        default: []
    },
    total_approved_od: {
        type: Number,
        default: 0
    },
    firstLogin: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_PRIVATE_KEY);
    return token;
}

const Admin = mongoose.model('Admin', adminSchema);

const validateAdmin = (admin) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        loginId: Joi.string().min(3).max(50).required(),
        password: passwordComplexity().required(),
        role: Joi.string().required(),
        batches: Joi.array().items(Joi.objectId()),
        mentors: Joi.array().items(Joi.objectId()),
        pic: Joi.array().items(Joi.objectId()),
        total_approved_od: Joi.number()
    });

    return schema.validate(admin);
}

export { Admin, validateAdmin };
export default Admin;