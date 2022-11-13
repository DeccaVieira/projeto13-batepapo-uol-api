import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import {MongoClient} from 'mongodb';
import { Await } from 'react-router-dom';
import joi from 'joi'
 
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db('chat')

try{
    mongoClient.connect()
    console.log("connected database")
}catch (err) {
    console.log(err);
}




app.listen(5000, () =>{ 
    console.log("Running in port 5000")
})