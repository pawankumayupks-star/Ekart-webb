import express  from 'express';
const prouter = express.Router();
import mycontrols from '../controllers/controller.js';
import multer from 'multer';
let memory = multer.memoryStorage();
const upload = multer({storage:memory});

prouter.get("/",mycontrols.homePage);
prouter.get('/about',mycontrols.aboutPage);
prouter.get('/contact',mycontrols.contactPage);
prouter.get('/register',mycontrols.registerPage);
prouter.get('/login',mycontrols.loginPage);
prouter.get('/forgetpass',mycontrols.forgetpassPage);

prouter.post('/register', upload.single('photo') ,mycontrols.register);
prouter.post('/verifyaccount',mycontrols.verifyemail);
prouter.post('/verifylater',mycontrols.verifyagain);
prouter.post('/login',mycontrols.login);
prouter.post('/forgetpass',mycontrols.forgetpass);
prouter.post('/verifyotp',mycontrols.updatepass);
prouter.post('/updatepass',mycontrols.savenewpass);

export default prouter;