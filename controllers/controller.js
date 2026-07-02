import pubmodel from "../models/pubmodel.js";
import admmodel from "../models/admmodel.js";

const homePage = (req,res)=>{
    pubmodel.products((status,productresult)=>{
        switch (status) {
            case "success":
                res.render('index',{products:productresult,msg:undefined});
                break;
            default:
                res.render('index',{products:null,msg:'No products Server Error',type:'danger'});
                break;
        }
    });
};

const aboutPage = (req,res)=>{
    res.render('about');
};

const contactPage = (req,res)=>{
    res.render('contact');
}

const registerPage = (req,res)=>{
    res.render('register',{msg:undefined});
}

const loginPage = (req,res)=>{
    res.render('login',{msg:undefined});
}

const register = (req,res)=>{
    let user = req.body;
    let userphoto = {pic:req.file.buffer, format: req.file.mimetype}

    if(!user.name || !user.mobile || !user.email || !user.password || !user.policy){
        res.render('register',{type:'danger',msg:"Registration Failed plese fill name , mobile, email, password, accept policy"});
    }else{
        pubmodel.register(user, userphoto ,(regstatus,regresult)=>{
            switch (regstatus) {
                case "alreadyReg":
        res.render('register',{type:'danger',msg:"Registration Failed because given email already registered"});                    
                    break;
                case"success":
                    res.render('regverify',{type:'success',msg: `Your Registration successful: ${regresult}`,useremail:user.email}); 
                default:
                    break;
            }
        });
    }
}

const verifyemail = (req,res)=>{
    let verifydata = req.body;
    if(! verifydata.otp){
        res.render('regverify',{type:'danger',msg: `Please Enter Enter OTP`,useremail:verifydata.email});
    }else{
        pubmodel.accountverify(verifydata, (verfistatus)=>{
            switch (verfistatus) {
                case "success":
                    res.render('login',{type:'success',msg:'Your Account is Activated, can login and Enjoy Services.'});
                    break;
                case "failed":
        res.render('regverify',{type:'danger',msg: `Entered OTP Doesn't Match`,useremail:verifydata.email});
                    break;
                default:
        res.render('regverify',{type:'danger',msg: `Account Verification failed due to Server Error`,useremail:verifydata.email});                    
                    break;
            }
        });
    }
}

const verifyagain = (req,res)=>{
    let verifyagainemail = req.body.email;
    if(! verifyagainemail ){
        res.render('register',{msg:"Please Enter Email to Send you OTP.",type:'danger'});
    }else{
        pubmodel.emailverify(verifyagainemail,(verifyresult)=>{
            switch (verifyresult) {
                case "notfound":
                    res.render('register',{msg:"Given Email is not registered.",type:'danger'});
                    break;
                case "success":
                    res.render('regverify',{msg:"Email OTP sent successful you can verify & login.",type:'success',useremail:verifyagainemail});
                    break;
                default:
                    res.render('register',{msg:"EmailSend failed doue to server error.",type:'danger'});
                    break;
            }
        });
    }
}

const login = (req,res)=>{
    let logindata = req.body;
    if(! logindata.email || ! logindata.password){
        res.render('login',{msg:"Please Enter Email & Password",type:'danger'});
    }else{
        pubmodel.login(logindata,(loginstatus,logininfo)=>{
            switch (loginstatus) {
                case "notfound":
                    res.render('login',{msg:"Enter Email not registered",type:'danger'});
                    break;
                case "incorrect":
                    res.render('login',{msg:"Enter Password not match",type:'danger'});
                    break;
                case "inactive":
                    res.render('login',{msg:"Your Account is not Activated, verify email first",type:'danger'});
                break;
                case "success":
                    // res.render('stddashboard',{msg:"Welcome to E Kart",type:'success',user:logininfo});
                    req.session.user = logininfo;
                    res.redirect('/user');
                    break;
                default:
                    res.render('login',{msg:"Login Failed due to Server error.",type:"danger"});
                    break;
            }
        });
    }
}

const forgetpassPage = (req,res)=>{
        res.render('forgetpass',{msg:undefined});
}

const forgetpass = (req,res)=>{
    let userinfo = req.body;
    if(! userinfo.email){
        res.render('forgetpass',{msg:"Please Enter Registered Email-ID",type:"danger"});
    }else{
        pubmodel.emailverify(userinfo.email,(forgetresult)=>{
            switch (forgetresult) {
                case "notfound":
                res.render('forgetpass',{msg:"Entered Email not Registered",type:"danger"});   
                    break;
                case "success":
                res.render('otpforpass',{msg:"Email Sent to your Email ID.",type:'success',useremail:userinfo.email});
                break;
                default:
                    res.render('forgetpass',{msg:"Update Password failed deu to server error.",type:"danger"});
                    break;
            }
        });
    }
}

const updatepass = (req,res)=>{
    let userinfo = req.body; 
    res.render('updatepass',{msg:undefined,type:'danger',useremail:userinfo.email});
}

const savenewpass = (req,res)=>{
    let userinfo = req.body;
    if(! userinfo.newpassword){
        res.render('updatepass',{msg:"Please Enter New Password & Retype",type:'danger',useremail:userinfo.email});
    }else{
        pubmodel.updatepassword(userinfo,(updresult)=>{
            res.render('login',{msg:"Your Password is Updated, please login",type:'success'});
        });
    }
}

const userhomePage = (req,res)=>{
    res.render('userdashboard',{msg:"Welcome to E Kart",type:'success',user:{name:req.session.user.name}});
}

const userprofile = (req,res)=>{
    let logindata = req.session.user;
        if( logindata != null){
            res.render('userprofile',{user:logindata,msg:undefined});
        }
}

const logout = (req,res)=>{
        if(req.session.user != null){
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.render('login',{msg:"Logout Successful.",type:'success'});
    }
}
const logoutAdmin = (req,res)=>{
        if(req.session.adminData != null){
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.render('login',{msg:"Logout Successful.",type:'success'});
    }
}

const updateprofile = (req,res)=>{
    let updateinfo = req.body;
    let updatephoto = {pic:req.file.buffer, format: req.file.mimetype}
    if( ! updateinfo.name || ! updateinfo.mobile || ! updateinfo.address || ! updateinfo.password ){
        res.render('userprofile',{user:updateinfo,msg:"Please Enter all Fields for update profile.",type:'danger'});
    }else{
        pubmodel.updaterofile(updateinfo,updatephoto,(updstatus, updinfo)=>{
            if(updstatus == 'success'){
                res.render("userprofile",{user:updinfo,msg:"Profile updated successful.",type:'success'});
            }
        });
    }
}

const adminloginPage = (req,res)=>{
    res.render('admlogin',{msg:undefined});
}

const adminlogin = (req,res)=>{
    let admininfo = req.body;
    if(! admininfo.adminid || ! admininfo.adminpass){
        res.render('admlogin',{msg:'Enter Valid ID & Password ',type:'danger'});
    }else{
        admmodel.adminLogin(admininfo,(loginresult,admin)=>{
            switch (loginresult) {
                case 'notfound':
        res.render('admlogin',{msg:'Enter ID & Password not found in database',type:'danger'});
                    break;
                case 'invalid':
        res.render('admlogin',{msg:'Enter ID or Password Not Match',type:'danger'});
                    break;
                    case "success":
                        req.session.adminData = admin;
        res.redirect('/admin/dashboard');            
                    break;
                default:
        res.render('admlogin',{msg:'Login Failed due to server eror',type:'danger'});
                    break;
            }
        })
    }
}

const adminDashboard = (req,res)=>{
    res.render('admindashboard',{admin:req.session.adminData});
}

const adminUsers = (req,res)=>{
    admmodel.users((result,allusers)=>{
        switch (result) {
            case "notfound":
                    res.render("adminusers",{users:null,msg:"Not Found",type:'danger'});
                break;
            case 'success':
                res.render('adminusers',{users:allusers,msg:'Users Found',type:'success'});
                break;
            default:
                res.render('adminusers',{users:null,msg:'server error',type:'danger'});
                break;
        }
    });
}

const adminUserDelete = (req,res)=>{
    let uid = req.params.id;
    admmodel.userDelete(uid,(deleteResult,allusers)=>{
        switch (deleteResult) {
            case true:
                res.render('adminusers',{users:allusers,msg:"User Account Deleted success",type:'success'});
                break;
            default:
                res.render("adminusers",{users:allusers,msg:'User Account Delete Failed due to Server Error.',type:'danger'});
                break;
        }
    });
};

const adminUserUpdate = (req,res)=>{
    let newid = req.params.id;
    admmodel.getUser(newid,(userresult,userData)=>{
        switch (userresult) {
            case "success":
                res.render('adminuserupdate',{user:userData,msg:'Data Received for update',type:'success'});
                break;
            default:
                res.render('adminuserupdate',{user:null,msg:'Data Not get, server error',type:'danger'});
                break;
        }
    })
};

const adminupdateprofile = (req,res)=>{
    let userdata = req.body;
    let userphoto = {pic:req.file.buffer,format:req.file.mimetype};
        admmodel.updateUserProfile(userdata,userphoto,(updateresult, updatedData)=>{
                switch (updateresult) {
                    case 'success':
                        res.render('adminuserupdate',{user:updatedData,msg:'Update Successful',type:'success'});
                        break;
                    default:
                        res.render('updateUserProfile',{user:updatedData,msg:'Update Failed due to server error',type:'danger'});
                        break;
                }
        }); 
}

const adminaddProductPage = (req,res)=>{
    res.render('adminaddproduct',{msg:undefined,type:'danger'});
}

const adminproductadd = (req,res)=>{
    let productinfo = req.body;
    let photo = {pic:req.file.buffer, formate:req.file.mimetype}
    admmodel.addproduct(productinfo,photo,(result,status)=>{
        switch (result) {
            case 'success':
                res.render('adminaddproduct',{msg:`Product add successful. ${status}`,type:'success'});
                break;
            default:
                res.render('adminaddproduct',{msg:'Product add Failed due to server error.',type:'danger'});
                break;
        }
    })
}

const productsPage = (req,res)=>{
        pubmodel.products((status,productresult)=>{
        switch (status) {
            case "success":
                res.render('productspage',{products:productresult,msg:undefined});
                break;
            default:
                res.render('productspage',{products:null,msg:'No products Server Error',type:'danger'});
                break;
        }
    });
}

const viewproductPage = (req,res)=>{
    let id = req.params.id;
    pubmodel.productDetails(id,(productstatus,result)=>{
        switch (productstatus) {
            case 'success':
                res.render('productdetail',{product:result,msg:'buy your product',type:'success'});          
                break;
            default:
                res.render('productdetail',{product:null,msg:'Product not found due to server error',type:'danger'});
                break;
        }
    })

}

const buynowPage = (req,res)=>{
    let id = req.params.id;
    let buyer = req.session.user.email;
    pubmodel.addtokart(pid,buyer,(buystatus,result)=>{
    });
}

const checkout = (req,res)=>{
    let productid = req.params.id;
    let userid = req.session.user.email;
    pubmodel.productorder(productid,userid,(orderstatus,result)=>{
        switch (orderstatus) {
            case "success":
                res.render('payment',{msg:`Your Order Ready to Place after confirm payment ${result}.`,type:'success'});
                break;
                default:
                res.render('payment',{msg:'Order Failed due to Server error',type:'danger'});
                break;
        }
    });
}

const billing = (req,res)=>{
    res.render('userdashboard',{msg:"Your Order Placed Success.",type:'success',user:{name:req.session.user.name}});
}

const adminProducts = (req,res) =>{
      admmodel.products((prostatus,productlist)=>{
        switch (prostatus) {
            case "not found":
            res.render('adminproducts',{products:null,msg:'Product Not found',
            type:'danger'});    
                
            break;

            case "success":
            res.render('adminproducts',{products:productlist,msg:"Products found",
            type:'succes' });
            default:
            res.render('adminproducts',{products:null,msg:"Product Not Found server Error",
            type:"danger"});
            break;
        }
      });
}

const adminProductDelete = (res,req) =>{
     let proid = req.params.id;
     admmodel.ProductDelete(proid,(deleteResult,allproducts)=>{
        switch (deleteResult) {
            case true:
                res.render('adminproducts',{msg:"Product Delete Sucess",
                    type:"success",products:allproducts});
                
                break;
        
            default:
                res.render('adminproducts',{msg:"Product Delete failed due to Server Error ",
                    products:allproducts});
                break;
        }
     });
}

const adminProductUpdate =(req,res) =>{
       let newid = req.params.id;
       admmodel.getProduct(newid,(productstatus,result)=>{
          switch (productstatus) {
            case "success":
                res.render('adminupdateproduct',{productdata:result,msg:'Product ready for Update.',
                    type:'sucess'});
                break;
          
            default:
                res.render('adminupdateproduct',{productdata:null,msg:'Product not get for update.',
                    type:'danger' });
                break;
          }
       });
}

const adminProductUpdated =(req,res)=>{
    let productdata = req.body;
    let productphoto = {pic:req.file.buffer,formate:req.file.mimetype};
    admmodel.updateProduct(productdata,productphoto,(updateresult,updatedData)=>{
        switch (updateresult) {
            case 'success':
                res.render('adminupdateproduct',{productdata:updatedData,msg:"Product Update Success",
                    type:'success'});
                
                break;
                res.render('adminupdateproduct',{productdata:updatedData,msg:'Product Update SuccesFailed due to server Error',
                    type:'danger'}) 
            default:
                break;
        }
    })
}
export default { homePage,aboutPage,registerPage,contactPage,loginPage,register, verifyemail, verifyagain, login,
                 forgetpassPage, forgetpass, updatepass, savenewpass, userhomePage, userprofile, logout, logoutAdmin, 
                 updateprofile, adminloginPage, adminlogin, adminDashboard, adminUsers, adminUserDelete, adminUserUpdate, adminupdateprofile,
                 adminaddProductPage, adminproductadd, productsPage, viewproductPage ,buynowPage, checkout, billing ,adminProductUpdate,
                 adminProducts, adminProductDelete, adminProductUpdated}