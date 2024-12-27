//Import: Dependencies

import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//Schema

const ondutySchema = new mongoose.Schema({
    studentDetails: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
    },
    mentorId: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
    },
    picId: {
        type: String,
        default: 'pic'
    },
    type: {
        type: String,
        required: true,
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true,
    },
    loggerId: {
        type: String,
        required: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    }
});

const Onduty = mongoose.model('Onduty', ondutySchema);

//Function

function validateOnduty(onduty) {
    const schema = Joi.object({
        studentDetails: Joi.string().required(),
        mentorId: Joi.string().required(),
        type: Joi.string().required(),
        from: Joi.date().required(),
        to: Joi.date().required(),
        loggerId: Joi.string().required(),
        eventName: Joi.string().required(),
        eventDescription: Joi.string().required()
    });

    return schema.validate(onduty);
}

//Export

export { Onduty, validateOnduty };
export default Onduty;