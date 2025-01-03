//import: Dependencies

import mongoose, { Schema } from "mongoose";
import Joi from "joi";

//Schema

const mentorSchema = new mongoose.Schema({
    mentorId: {
        type: String,
        required: true,
    },
    mentorName: {
        type: String,
        required: true,
    },
    mentorEmail: {
        type: String,
        required: true,
    },
    mentorPassword: {
        type: String,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    ondutyApplications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OndutyApplication'
    }],
    totalApproved: {
        type: Number,
        default: 0
    },
    totalRejected: {
        type: Number,
        default: 0
    },
    role : {
        type: String,
        default: 'mentor'
    }
});

const Mentor = mongoose.model("mentors", mentorSchema);

//Validation

const validateMentor = (mentor) => {
    const schema = Joi.object({
        mentorId: Joi.string().required(),
        mentorName: Joi.string().required(),
        mentorEmail: Joi.string().required(),
    });
    return schema.validate(mentor);
};

export { Mentor, validateMentor };
export default Mentor;