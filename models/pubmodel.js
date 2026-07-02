import mongodbDatabase from './mongodbDatabase.js';
import {mymodel} from './user.js';
import { orderModel } from './order.js';
import  dotenv  from 'dotenv';
import mailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { ObjectId, ReturnDocument } from 'mongodb';
dotenv.config();


const generateOTP = ()=>{
    let OTP = "";
    let chars = "123456789";
    for (let index = 0; index < 6; index++) {
        const element = Math.floor(Math.random() * 9 );
        OTP += chars.charAt(element);        
    }
    return OTP;
}

const sendMail = (useremail, generatedOTP)=>{
    const myemailSender = mailer.createTransport({
        service:"gmail.com",
        auth:{
            user:process.env.emailid,
            pass:process.env.emailpass,
        }
    });
    let email1 = { 
    from:process.env.emailid,
    to:useremail,
    subject:'E-KART OTP',
    text:`Hello, Account Verification OTP is ${generatedOTP} don't share with any other.`
}

myemailSender.sendMail(email1,(err,myemail)=>{
    if(err){
        console.error(err);
    }else{
        // console.log(myemail.response);
    }
});
}
const getUserinfo = async (verifyemail)=>{
    try {
         let db = await mongodbDatabase.getConnect();
        let col = db.collection('users');
        return await col.findOne({email:verifyemail});
    } catch (err) {
        console.error(`Error in get Userinfo: ${err} `)
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const getProductinfo = async (objid)=>{
    try {
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('products');
        let result = await col.findOne(objid);
        return result;
    } catch (err) {
        console.error(`ERROR in get Product ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
};


const register = async (user, userphoto,callback)=>{
    let checkuser = await getUserinfo(user.email);
    if(checkuser != null){
        callback('alreadyReg',false);
    }else{
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('users');
        let encryptPassword = await bcrypt.hash(user.password,10);
            let newOTP = generateOTP();
            sendMail(user.email,newOTP);
            let finaluser = new mymodel({
            name:user.name,
            mobile:user.mobile,
            email:user.email,
            address:user.address,
            password:encryptPassword,
            pincode:user.pincode,
            policy:user.policy,
            acstatus:"Deactive",
            photo: userphoto.pic,
            photoFormat:userphoto.format,
            otp:newOTP,
        });
        try {
            let result =await col.insertOne(finaluser);
            return callback('success',result.acknowledged);
            
        } catch (err) {
         console.error(`Error in register ${err}`);   
        }finally{
            await mongodbDatabase.getDiconnect();
        }
    }
} ;

const accountverify = async (verifydata,callback)=>{
    try {
        let userDatabase = await getUserinfo(verifydata.email);
        if(userDatabase.otp === verifydata.otp){
    
            let db  = await mongodbDatabase.getConnect();
            let col = db.collection('users');
            let result = await col.updateOne({email:verifydata.email},{$set:{acstatus:"Active"}});
            return callback('success');
        }else{
            return callback('failed');
        }
    } catch (err) {
        console.error( `Error in account verify: ${err}`)
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const emailverify = async (verifyagainemail,callback)=>{
    try {
            let userinfo = await getUserinfo(verifyagainemail);
            if(userinfo == null){
                callback('notfound');
            }else{
        let newOTP =  generateOTP();
        sendMail(verifyagainemail,newOTP);
        let db = await mongodbDatabase.getConnect();
        let con = db.collection('users');
        let result = await con.updateOne({email:verifyagainemail},{$set:{otp:newOTP}});
        return callback('success');
      }
        } catch (err) {
            console.error(`Error in email verify ${err}`);
        }finally{
            await mongodbDatabase.getDiconnect();
        }
}

const login = async (logindata, callback)=>{
    try {
        let userinfo = await getUserinfo(logindata.email);
        if(userinfo == null){
            return callback('notfound',userinfo);
        }else{
            if(! await bcrypt.compare(logindata.password , userinfo.password) ){
                return callback('incorrect',userinfo);
            }else{
                if(userinfo.acstatus != "Active"){
                return callback("inactive",userinfo);
                }else{
                    return callback('success',userinfo);
                }
            }
        } 
    } catch (err) {
        console.error(`Error in Login ${err}`)
    }

}

const updatepassword = async (userinfo, callback)=>{
    try {
        let db = await mongodbDatabase.getConnect();
        let con = db.collection('users');
        let newpass = await bcrypt.hash(userinfo.newpassword,10);
        let result = await con.updateOne({email:userinfo.email},{$set:{password:newpass}});
        return callback('success');
        
    } catch (err) {
        console.error(`Error in Update password: ${err}`)
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const updaterofile = async (updateinfo,updatephoto, callback )=>{
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
        console.error(`Error in update ${err}`)
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const products = async (callback)=>{
    try {
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('products');
        let list = await col.find().toArray();
        return callback("success",list);
    } catch (error) {
        console.error(`ERROR in get Products:error`);
        return callback("error",null);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const productDetails = async (id, callback)=>{
    try {
        let newid = {_id:new ObjectId(id)};

        let db = await mongodbDatabase.getConnect();
        let col= db.collection('products');
        let item = await col.findOne(newid);
        return callback('success',item);
    } catch (err) {
        console.error(`Erorr in get Product ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}

const productorder = async (productid,userid,callback)=>{
    try {
        let id = {_id: new ObjectId(productid)};
        let productinfo = await getProductinfo(id);

        let finalorder = new orderModel({
            name:productinfo.name,
            category:productinfo.category,
            price:productinfo.price,
            discount:productinfo.discount,
            quantity:productinfo.quantity,
            useremail:userid,
        });
        let db = await mongodbDatabase.getConnect();
        let col = db.collection('orders');
        let result = await col.insertOne(finalorder);
        return callback('success',result.acknowledged);
    } catch (err) {
        console.error(`ERROR in Place Order: ${err}`);
    }finally{
        await mongodbDatabase.getDiconnect();
    }
}
export default {register, accountverify, emailverify, login, updatepassword, updaterofile, products, productDetails, productorder}