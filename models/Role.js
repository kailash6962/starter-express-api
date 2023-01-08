import mongoose from "mongoose";
const {Schema} = mongoose;

const RoleSchema = new Schema({
    
    RoleName: {
        type: String,
        trim: true,
        required : 'RoleName is required'
    },
    Description: {
        type: String,
        trim: true,
        required : 'Fill description'
    },
    AccessLinks: {
        type: Array,
        trim: true,
        required : 'Select atleast 1 Link'
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
    ReadOnly: {
        type: Boolean,
        default : false
    },
},{ timestamps: true });

export default mongoose.model("Role",RoleSchema);