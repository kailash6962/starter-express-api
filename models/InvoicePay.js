import { json } from "express";
import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoicePaySchema = new Schema({
    PaymentId: {
        type: String,
        trim: true,
        required : 'PaymentId is required'
    },
    PaymentDate: {
        type: String,
        trim: true,
        required : 'Invoice Date is required'
    },
    CustCode: {
        type: String,
        trim: true,
        required : 'CustCode is required'
    },
    Attachments: {
        data: Buffer,
        contentType: String
    },
    Status: {
        type: String,
        trim: true
    },
    AmtPaid: {
        type: String,
        trim: true
    },
    PaymentMode: {
        type: String,
        trim: true
    },
    PaymentBy: {
        type: String,
        trim: true
    },
    PaymentReference: {
        type: String,
        trim: true
    },
    Notes: {
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

export default mongoose.model("InvoicePay",InvoicePaySchema);