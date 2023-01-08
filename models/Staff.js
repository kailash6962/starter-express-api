import mongoose from "mongoose";
const {Schema} = mongoose;

const StaffSchema = new Schema({
    Staffid: {
        type: String,
        trim: true,
        required : 'Staffid is required'
    },
    StaffName: {
        type: String,
        trim: true,
        required : 'Name is required'
    },
    AddrLine1: {
        type: String,
        trim: true,
        required : 'Addr 1 is required'
    },
    AddrLine2: {
        type: String,
        trim: true,
        required : 'Addr 2 is required'
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required : 'Please Enter User email'
    },
    mobile: {
        type: String,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        required : 'Please select User Role'
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
    active:{
        type: Boolean,
    },
},{ timestamps: true });

export default mongoose.model("Staff",StaffSchema);