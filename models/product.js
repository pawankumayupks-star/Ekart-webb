import mongoose from "mongoose";

const schema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:false,
    },
    quantity:{
        type:Number,
        required:true,
    },
    detail:{
        type:String,
        required:false,
    },
    photo:{
        type:Buffer,
        contentType:String,
        required:false
    },
    photoFormat:{
        type:String
    },
    check:{
        type:String,
        required:true,
    }
});

let proModel = mongoose.model('products',schema);

export {proModel};