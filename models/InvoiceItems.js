import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoiceItemsSchema = new Schema({
    prodName: {
        type: String,
        trim: true
    },
    Invid: {
        type: String,
        trim: true,
        required : 'InvoiceId is required'
    },
    prodDesc: {
        type: String,
        trim: true
    },
    rate: {
        type: String,
        trim: true,
        required : 'price is required'
    },
    unit: {
        type: String,
        trim: true,
    },
    quantity: {
        type: String,
        trim: true,
        unique: false,
    },
    lineTotal: {
        type: String,
        trim: true,
        unique: false,
    },
    UserId: {
        type: String,
        trim: true,
    },
    OrgId: {
        type: String,
        trim: true,
        required : 'Id is required'
    },
},{ timestamps: true });

export default mongoose.model("InvoiceItems",InvoiceItemsSchema);