import mongoose from "mongoose";
const {Schema} = mongoose;

const CustomerSchema = new Schema({
    Custid: {
        type: String,
        trim: true,
        required : 'CustCode is required'
    },
    custName: {
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
    },
    mobile: {
        type: String,
        unique: true,
        trim: true,
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

export default mongoose.model("Customers",CustomerSchema);