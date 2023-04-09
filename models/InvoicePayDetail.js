import { json } from "express";
import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoicePayDetailSchema = new Schema({
    PaymentId: {
        type: String,
        trim: true,
        required : 'PaymentId is required'
    },
    Invid: {
        type: String,
        trim: true,
        required : 'InvoiceId is required'
    },
    Status: {
        type: String,
        trim: true
    },
    AmtPaid: {
        type: String,
        trim: true
    },
    UserId: {
        type: String,
        trim: true,
        required : 'UserId is required'
    },
    OrgId: {
        type: String,
        trim: true,
        required : 'OrgId is required'
    },
},{ timestamps: true });

export default mongoose.model("InvoicePayDetail",InvoicePayDetailSchema);