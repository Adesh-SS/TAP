import mongoose from "mongoose";
import Joi from "joi";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    batchName: {
        type: String,
        required: true,
        minlength: 3
    },
    studentsIds: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
        default: []
    },
    studentsCount: {
        type: Number,
        default: 0
    },
    onDutys: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OnDuty' }],
        default: []
    }
})

const Department = mongoose.model('Department', departmentSchema);

const validateDepartment = (department) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        batchName: Joi.string().min(3).required()
    })
    return schema.validate(department);
}

export { Department, validateDepartment };
export default Department;