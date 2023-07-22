import mongoose from "mongoose";
const {Schema} = mongoose;

const ProductSchema = new Schema({
    ProdId: {
        type: String,
        trim: true,
        required : 'ProdId is required'
    },
    prodName: {
        type: String,
        trim: true,
        required : 'prodName is required'
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        trim: true,
        required : 'price is required'
    },
    unit: {
        type: String,
        trim: true,
        required : 'unit is required'
    },
    stockCounts: {
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

export default mongoose.model("Product",ProductSchema);