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




app.listen(5000, () =>{ 
    console.log("Running in port 5000")
})