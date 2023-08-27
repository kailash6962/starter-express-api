import mongoose from "mongoose";
const {Schema} = mongoose;

const CategorySchema = new Schema({
    Category: {
        type: String,
        trim: true,
        required : 'CategoryName is required'
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

export default mongoose.model("Category",CategorySchema);