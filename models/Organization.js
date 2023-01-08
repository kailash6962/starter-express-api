import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const {Schema} = mongoose;


const OrganizationSchema = new Schema({

    OrgId: {
        type: String,
        trim: true,
        unique: true,
        required : 'Id is required'
    },
    name: {
        type: String,
        trim: true,
        required : 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        required : 'Email is required',
        unique: true,
    },
    
    profile_img:
    {
        data: Buffer,
        contentType: String
    },
    company_name:
    {
        type: String,
    },
    mobile:
    {
        type: String,
    },
    Address:
    {
        type: String,
    },
    custCode_prefix: {
        type: String,
        required: false,
    },
    Industry: {
        type: String,
    },
    
    active:{
        type: Boolean,
    },
    stripe_account_id:'',
    stripe_seller: {},
    stripeSession: {}
},{ timestamps: true });

export default mongoose.model("Organization",OrganizationSchema);