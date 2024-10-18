//import: Dependencies

import mongoose, { mongo, Mongoose } from 'mongoose';
import Joi from 'joi';

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
    }
});

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

export { Student, validateStudent };
export default Student;