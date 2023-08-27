import mongoose from "mongoose";
const {Schema} = mongoose;

const UnitsSchema = new Schema({
    Unit: {
        type: String,
        trim: true,
        required : 'Unit is required'
    },
    LabelName: {
        type: String,
        trim: true,
        required : 'LabelName is required'
    },
    Description: {
        type: String,
        trim: true,
        required : 'Description is required'
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

export default mongoose.model("Units",UnitsSchema);