import { ObjectId } from "mongodb";
import mongodbDatabase from "./mongodbDatabase.js";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import { mymodel } from "./user.js";
import {proModel} from './product.js';

dotenv.config();
const admin = {name:process.env.adminid,password:process.env.admpass};

const adminLogin = (admininfo, callback)=>{
    if (admininfo.adminid != admin.name){
        return callback('notfound',null)
    }else{
        if(admininfo.adminpass != admin.password){
            return callback('invalid',null);
        }else{
            return callback('success',admin);
        }
    }
}

const users =async (callback)=>{
    try {
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('users');
        let result = await col.find().toArray();
        if(result.length == 0){
            return callback("notfound",result)
        }else{
            return callback('success',result);
        }
    } catch (err) {
        console.error(`ERROR in Get Users ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const userDelete = async (id, callback)=>{
    try {
        let newid = new ObjectId(id);
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('users');
        let result = await col.deleteOne({_id:newid});
        let allusers = await col.find().toArray();
        if(result.acknowledged == true){
            return callback(result.acknowledged,allusers);
        }else{
            return callback(false,null);
        }
    } catch (error) {
        console.error(`Error in Delete Account ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const getUser = async (id,callback)=>{
    let newid = new ObjectId(id);

    try {
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('users');
        let userData =await col.findOne({_id:newid});
        if(userData != null){
            return callback('success',userData);
        } else{
            return callback('notfound',null);
        }       
    } catch (error) {
        console.error(`ERROR in get user info: ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const updateUserProfile = async (updateinfo,updatephoto,callback)=>{
    try {
        let id = {_id:new ObjectId(updateinfo.objectid)};
        let encryptPassword = await bcrypt.hash(updateinfo.password,10); 
            let finaluser = new mymodel({
                _id: id,
                name:updateinfo.name,
                mobile:updateinfo.mobile,
                email:updateinfo.email,
                address:updateinfo.address,
                password:encryptPassword,
                pincode:updateinfo.pincode,
                policy:updateinfo.policy,
                acstatus:updateinfo.acstatus,
                photo: updatephoto.pic,
                photoFormat:updatephoto.format,
                otp:updateinfo.otp,
            });
    
            let db = await mongodbDatabase.getConnect();
            let col = db.collection('users');
            let update =await col.findOneAndUpdate({email:updateinfo.email},{$set:finaluser},{returnDocument:'after'});
            return callback('success',update);
    } catch (err) {
        console.error(`Error in Admin update ${err}`)
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const addproduct = async (productinfo,photo,callback)=>{

    try {
        let finalproduct = new proModel({
        name: productinfo.name,
        category:productinfo.category,
        price:productinfo.price,
        discount:productinfo.discount,
        quantity:productinfo.quantity,
        detail:productinfo.detail,
        photo:photo.pic,
        photoFormat:photo.formate,
        check:productinfo.check
    });
    let db = await mongodbDatabase.getConnect();
    let col=  db.collection('products');
    let result = await col.insertOne(finalproduct);
        if(result.acknowledged){
            return callback('success',result.acknowledged);
        }else{
            return callback('failed',null);
        }
    } catch (err) {
        console.error(`ERROR in add product: ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const products = async (callback)=>{
    try {
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('products');
        let result = await col.find().toArray();

        if(result.length == 0){
            return callback('not found',null);
        }else{
            return callback('success',result)
        }
    } catch (error) {
        console.error(`Error in get product:${err}`);
    } finally{
        await mongodbDatabase.getDiconnect();
    }
}

const ProductDelete = async (proid,callback)=>{
    let id = {_id:new ObjectId(proid)};
    try {
         let db = await mongodbDatabase.getConnect();
         let col = db.collection('products');
         let result = await col.deleteOne(id);
         let allproducts = await col.find().toArray();
         if (result.acknowledged == true) {
             return callback(result.acknowledged,allproducts)            
         } else {
            return callback(false,null);
         }
    } catch (err) {
        console.error(`Error in Delete Product ${err}`);
    } finally{
        await mongodbDatabase.getDiconnect();
    }
}

const getProduct =async (id,callback)=>{
        let newid ={_id: new ObjectId(id)};

        try {
            let db = await mongodbDatabase.getConnect();
            let col = db.collection('products');
            let result = await col.findOne(newid);
            if (result != null) {
                return callback('success', result);
            } else {
                return callback('not found',null);
            }
        } catch (err) {
            console.error(`Error in get Product ${err}`);
            
        }finally{
            await mongodbDatabase.getDiconnect();
        }
}

const updateProduct = async(upddata,updphoto,callback)=>{
    let newid = {_id:new ObjectId(upddata.id)}
    try {
        let finalproduct = new proModel({
        _id:newid,
        name: upddata.name,
        category:upddata.category,
        price:upddata.price,
        discount:upddata.discount,
        quantity:upddata.quantity,
        detail:upddata.detail,
        photo:upddata.pic,
        photoFormat:upddata.formate,
        check:upddata.check,
    });

    let db = await mongodbDatabase.getConnect();
    let col = db.collection('products');
    let result = await col.findOneAndUpdate(newid,{$set:finalproduct},{returnDocument:'after'});
       if (result != null) {
            return callback('success',result);
       } else {
         return callback('failed',null);
       }
        
    } catch (error) {
        console.error(`Error in Update product:$(err)`)
    }finally{
        await mongodbDatabase.getDiconnect();

    }
}


export default {adminLogin, users, userDelete, getUser, updateUserProfile, addproduct,
                  products, ProductDelete,getProduct,updateProduct }