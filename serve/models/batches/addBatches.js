import mongoose from "mongoose";
import Joi from "joi";

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    },
    studentsCount: {
        type: Number,
        required: true,
        default: 0
    },
    departments: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
        default: []
    }
})

const Batch = mongoose.model('Batch', batchSchema);

const validateBatch = (batch) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(10).pattern(/^\d{4}-\d{4}$/).required()
    })
    return schema.validate(batch);
}

export { Batch, validateBatch };
export default Batch;