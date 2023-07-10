import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

export default mongoose.model('category',CategoryModel)