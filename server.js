import express from 'express';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import session from 'express-session';
import nocache from 'nocache';
const app = express();
dotenv.config();
const PORT = process.env.port;

import publicrouter from './routers/publicrouter.js'; 
import userrouter  from './routers/userrouter.js'
import adrouter from './routers/adminrouter.js';

app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:1000 * 60 * 30 }
}));

app.set("view engine","ejs");
app.set("views",'views');
app.use(express.static('views'));
app.use('/admin',express.static('views'));
app.use('/user',express.static('views'));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(nocache());

app.use('/',publicrouter);
app.use('/user',userrouter);
app.use('/admin',adrouter);

app.listen(PORT,(err)=>{
    if(err){console.error(err)}
    else{
        console.info(`Server Running at ${PORT}`);
    }
});
