import { json } from "express";
import mongoose from "mongoose";
const {Schema} = mongoose;

const Model = new Schema({
    ExpenseId: {
        type: String,
        trim: true,
        required : 'ExpenseId is required'
    },
    ExpenseDate: {
        type: Date,
        trim: true,
        required : 'ExpenseDate is required'
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
    Amount: {
        type: Number,
        trim: true
    },
    Category: {
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

export default mongoose.model("Expense",Model);