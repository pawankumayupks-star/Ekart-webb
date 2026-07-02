import mongodb from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.uri;
const client =new mongodb.MongoClient(uri);

const getConnect = async ()=>{
    let con =await client.connect();
    let db = con.db(process.env.database);
    return db;
};

const getDiconnect = async ()=>{
    let discon = await client.close();
}

export default {getConnect,getDiconnect};