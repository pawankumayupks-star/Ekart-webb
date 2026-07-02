import mongoose from 'mongoose';

let schema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
    },
    address:{
        type:String,
        required:true,
        default:"indore"
    },
    password:{
        type:String,
        required:true,
        default:"user123"
    },
    pincode:{
        type:Number,
    },
    policy:{
        type:String,
    },
    acstatus:{
        type:String,
        required:true,
    },
    photo:{
        type:Buffer,
        contentType:String,
        required:false
    },
    photoFormat:{
        type:String,
    },
    otp:{
        type:String,
    }
});

let mymodel = mongoose.model('user',schema);

export {mymodel}