import mongoose from "mongoose";
const {Schema} = mongoose;

const ActivitylogSchema = new Schema({
    Module: {
        type: String,
        trim: true,
    },
    Id: {
        type: String,
        trim: true,
        required : 'Id is required'
    },
    Detail: {
        type: String,
        trim: true,
        required : 'Detail 1 is required'
    },
    UserId: {
        type: String,
        trim: true,
        required : 'UserId is required'
    },
    OrgId: {
        type: String,
        trim: true,
        required : 'Id is required'
    },
},{ timestamps: true });

export default mongoose.model("Activitylog",ActivitylogSchema);