import mongoose from "mongoose";
const {Schema} = mongoose;

const ErrorLogs = new Schema({
    ErrorReportId: {
        type: String,
        trim: true,
        required : 'ErrorReportId is required'
    },
    ErrorData: {
        type: JSON,
        required : 'ErrorData is required'
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

export default mongoose.model("ErrorLogs",ErrorLogs);