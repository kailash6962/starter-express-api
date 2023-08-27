import mongoose from "mongoose";
const {Schema} = mongoose;

const ProductSchema = new Schema({
    ProdId: {
        type: String,
        trim: true,
        required : 'ProdId is required'
    },
    ProdHSN: {
        type: String,
        trim: true,
    },
    prodName: {
        type: String,
        trim: true,
        required : 'prodName is required'
    },
    Category: {
        type: String,
        trim: true,
        required : 'category is required'
    },
    description: {
        type: String,
        trim: true,
    },
    costPrice: {
        type: String,
        trim: true,
        required : 'costPrice is required'
    },
    costPriceTax: {
        type: Boolean,
        trim: true,
        required : 'costPriceTax is required'
    },
    sellingPrice: {
        type: String,
        trim: true,
        required : 'costPrice is required'
    },
    Type: {
        type: String,
        trim: true,
        required : 'Type is required'
    },
    sellingPriceTax: {
        type: Boolean,
        trim: true,
        required : 'sellingPriceTax is required'
    },
    wholeSaleCount: {
        type: Number,
        trim: true,
        required : 'wholeSaleCount is required'
    },
    wholeSalePrice: {
        type: String,
        trim: true,
        required : 'wholeSalePrice is required'
    },
    wholeSalePriceTax: {
        type: Boolean,
        trim: true,
        required : 'wholeSalePriceTax is required'
    },
    openingQuantity: {
        type: Number,
        trim: true,
    },
    unit: {
        type: String,
        trim: true,
        required : 'unit is required'
    },
    stockCounts: {
        type: Number,
        trim: true,
        unique: false,
    },
    minimumStockCounts: {
        type: Number,
        trim: true,
        unique: false,
    },
    stockLocationCode: {
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