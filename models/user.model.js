import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModel = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:Number
    },
    image: {
        type: String
    },
    about: {
        type: String
    },
    role: {
        type: Number
    },
    otp: {
        type: Number
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

export default mongoose.model('user',UserModel)