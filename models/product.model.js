import mongoose from "mongoose";
import categoryModel from "./category.model";
const Schema = mongoose.Schema;

const ProductModel = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: categoryModel,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        default:0
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('product', ProductModel)