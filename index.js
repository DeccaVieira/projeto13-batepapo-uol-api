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

const participantSchema = joi.object({
    name: joi.string().required(),
      });
      let typeMessage = 'message' || 'private_message';

      app.post('/participants' , async (req, res) => {

        const participant = req.body;
        console.log(res.name)
    
    
        const validation = participantSchema.validate(participant, { abortEarly: false });
    
        if (validation.error) {
            const erros = validation.error.details.map((detail) => detail.message);
            res.status(422).send(erros);
            return;
          }
    try{
     await db.collection('participants').insertOne(participant);
     res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    
    })


app.listen(5000, () =>{ 
    console.log("Running in port 5000")
})