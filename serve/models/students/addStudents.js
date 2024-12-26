//import: Dependencies

import mongoose, { mongo, Mongoose } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//Schema

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    studentPassword: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    odApplied: {
        type: Number,
        default: 0
    },
    odApproved: {
        type: Number,
        default: 0
    },
    odRejected: {
        type: Number,
        default: 0
    },
    appliedOdList: {
        type: Array,
        default: []
    },
    approvedOdList: {
        type: Array,
        default: []
    },
    rejectedOdList: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        default: 'Student'
    }

});

studentSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET);
    return token;
};

const Student = mongoose.model('Student', studentSchema);

//Validation

function validateStudent(student) {
    const schema = Joi.object({
        studentId: Joi.string().required(),
        studentName: Joi.string().required(),
        studentEmail: Joi.string().required(),
        department: Joi.string().required(),
        batch: Joi.string().required(),
        mentorId: Joi.string().required()
    });

    return schema.validate(student);
}

function validateStudentLogin(student) {
    const schema = Joi.object({
        studentId: Joi.string().required(),
        studentPassword: Joi.string().required()
    });

    return schema.validate(student);
}

export { Student, validateStudent, validateStudentLogin };
export default Student;