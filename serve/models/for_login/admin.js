import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';
import passwordComplexity from 'joi-password-complexity';

dotenv.config();

const objectId = joiObjectId(Joi);

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
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
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
    }
}, { timestamps: true });

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    return token;
}

const Admin = mongoose.model('Admin', adminSchema);

const validateAdminLogin = (admin) => {
    const complexityOptions = {
        min: 6,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1
    }

    const complexitySchema = passwordComplexity(complexityOptions).required();

    const schema = Joi.object({
        loginId: Joi.string().required(),
        password: complexitySchema
    });

    return schema.validate(admin);
}

export { Admin, validateAdminLogin };
export default Admin;