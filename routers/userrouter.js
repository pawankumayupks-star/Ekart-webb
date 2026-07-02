import express from 'express';
const userrouter  = express.Router();
import mycontroller from '../controllers/controller.js';
import check  from '../controllers/checklogin.js'
import multer from 'multer';
const memory = multer.memoryStorage();
const upload = multer({storage:memory});

userrouter.get('/',check.verifylogin,mycontroller.userhomePage);
userrouter.get('/profile',check.verifylogin,mycontroller.userprofile);
userrouter.get('/productspage',check.verifylogin,mycontroller.productsPage);
userrouter.get('/buynow/:id',check.verifylogin,mycontroller.viewproductPage);
userrouter.get('/checkout/:id',check.verifylogin,mycontroller.checkout)

userrouter.post('/logout', mycontroller.logout);
userrouter.post('/userprofile',upload.single('photo'),mycontroller.updateprofile);
userrouter.post('/buynow/:id',check.verifylogin,mycontroller.buynowPage);
userrouter.post('/payment',check.verifylogin,mycontroller.billing);
export default userrouter;