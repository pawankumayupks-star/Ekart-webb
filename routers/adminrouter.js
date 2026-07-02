import express from 'express';
const adrouter = express.Router();
import mycontroller from '../controllers/controller.js';
import checklogin from '../controllers/checklogin.js';
import multer from 'multer';
const memory = multer.memoryStorage();
const upload = multer({ storage: memory });
adrouter.get('/', mycontroller.adminloginPage);
adrouter.get('/dashboard', checklogin.verifyloginAdmin, mycontroller.adminDashboard);
adrouter.get('/useres', checklogin.verifyloginAdmin, mycontroller.adminUsers)
adrouter.get('/updateUpser/:id', checklogin.verifyloginAdmin, mycontroller.adminUserUpdate);
adrouter.get('/deleteUser/:id', checklogin.verifyloginAdmin, mycontroller.adminUserDelete);
adrouter.get('/addproduct', checklogin.verifyloginAdmin, mycontroller.adminaddProductPage);
adrouter.get('/products',checklogin.verifyloginAdmin,mycontroller.adminProducts);
adrouter.get('/deleteProduct/:id',checklogin.verifyloginAdmin,mycontroller.adminProductDelete);
adrouter.get('/updateProduct/:id',checklogin.verifyloginAdmin,mycontroller.adminProductUpdate)


adrouter.post('/logout', mycontroller.logoutAdmin);
adrouter.post('/admlogin', mycontroller.adminlogin);
adrouter.post('/updateUpser', upload.single('photo'), checklogin.verifyloginAdmin, mycontroller.adminupdateprofile);
adrouter.post('/addproduct', checklogin.verifyloginAdmin, upload.single('photo'), mycontroller.adminproductadd);
adrouter.post('/updateProduct',checklogin.verifyloginAdmin,upload.single('photo'),mycontroller.adminProductUpdated);
export default adrouter;
