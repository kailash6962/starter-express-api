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
    Type: {
        type: String,
        trim: true,
        required : 'Name is required'
    },
    custDisplayName: {
        type: String,
        trim: true,
        required : 'DisplayName is required'
    },
    BillingAddress: {
        type: Map,
        trim: true,
        required : 'Addr 1 is required'
    },
    ShippingAddress: {
        type: Map,
        trim: true,
        required : 'Addr 2 is required'
    },
    email: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    openingBalance: {
        type: Number,
        trim: true,
    },
    openingBalanceType: {
        type: String,
        trim: true,
    },
    openingAsOn: {
        type: Date,
        trim: true,
    },
    creditLimit: {
        type: Number,
        trim: true,
    },
    gstin: {
        type: String,
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