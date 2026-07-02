const verifylogin = (req,res,next)=>{
    if(req.session.user != null){
        next();
    }else{
        res.render('login',{msg:"Please Login First.",type:"danger"});
    }
}

const verifyloginAdmin = (req,res,next)=>{
    if(req.session.adminData != null){
        next();
    }else{
        res.render('admlogin',{msg:"Please Login First.",type:"danger"});
    }
}
export default {verifylogin, verifyloginAdmin}