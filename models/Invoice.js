import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoiceSchema = new Schema({
    Invid: {
        type: String,
        trim: true,
        unique: true,
        required : 'InvoiceId is required'
    },
    custCode: {
        type: String,
        trim: true,
        required : 'Customer Code is required'
    },
    OrderNumber: {
        type: String,
        trim: true
    },
    InvDate: {
        type: String,
        trim: true,
        required : 'Invoice Date is required'
    },
    PaymentTerms: {
        type: String,
        trim: true,
        required : 'PaymentTerms is required'
    },
    DueDate: {
        type: String,
        trim: true,
        required : 'DueDate is required'
    },
    SalesPerson: {
        type: String,
        trim: true
    },
    Subject: {
        type: String,
        trim: true
    },
    SubTotal: {
        type: String,
        trim: true,
        required : 'SubTotal is required'
    },
    TaxType: {
        type: String,
        trim: true
    },
    TaxValue: {
        type: String,
        trim: true
    },
    Adjustment: {
        type: Object,
        trim: true,
    },
    Discount: {
        type: Number,
        trim: true,
    },
    AmtTotal: {
        type: String,
        trim: true,
        required : 'Invoice Total is required'
    },
    CustomerNotes: {
        type: String,
        trim: true
    },
    TermsAndConditions: {
        type: String,
        trim: true
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
    LastPaymentDate: {
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

export default mongoose.model("Invoice",InvoiceSchema);