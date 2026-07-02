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
    useremail:{
        type: String,
        required:true,
    }
});

let orderModel = mongoose.model('orders',schema);

export {orderModel};