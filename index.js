import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import { Await } from "react-router-dom";
import joi from "joi";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

let db;
let participants;
let participant;

const mongoClient = new MongoClient(process.env.MONGO_URI);
db = mongoClient.db("chat");

try {
  mongoClient.connect();
  console.log("connected database");
} catch (err) {
  console.log(err);
}

const participantSchema = joi.object({
  name: joi.string().required(),
  lastStatus: Date.now(),
});
console.log(participantSchema);

app.post("/participants", async (req, res) => {
  try {
    const validation = participantSchema.validate(participant, {
      abortEarly: false,
    });
    if (validation.error) {
      const erros = validation.error.details.map((detail) => detail.message);
      res.status(422).send(erros);
      return;
    }
    const newUser = req.body;

    const user = await db.collection("users").findOne({
      name: newUser.name,
    });

    if (!newUser.name) {
      res.sendStatus(422);
    }
    if (user) {
      res.sendStatus(409);
      return;
    }

    const userM = {
      from: newUser.name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
    };

    await db.collection("users").insertOne({
      ...newUser,
      lastStatus: Date.now(),
    });

    await db.collection("messages").insertOne({
      ...userM,
    });
  } catch {
    res.status(400);
  }
});

app.get("/participants", async (req, res) => {
  participant = req.headers.participant;
  try {
    participants = await db.collection("users").find().toArray();
    res.send(participants);
    
  }catch{
    console.log(err);
    res.sendStatus(400);
  }
    const messageSchema = joi.object({
      to: joi.string().required().min(1),
      text: joi.string().required().min(1),
      type: joi.string().pattern(/^(private_message|message)$/),
      lastTime: joi.any(),
      timeNow: joi.any(),
    });
})
app.post("/messages", async (req, res) => {
  try{

    const {user}= (req.headers)
    const userExists = await db.collection("users").findOne({
      name: user,
    })
    
    if (!userExists) {
      res.sendStatus(422)
      return
    }
    const userMessage = {
      from: user.name,
      time: dayjs().format("HH:mm:ss"),
      timeNow: Date.now()
    };
    const validation = messageSchema.validate(userMessage, { abortEarly: false });
    
    if (validation.error) {
      const erros = validation.error.details.map((detail) => detail.message);
      res.status(422).send(erros);
      return;
    }
    
    await db.collection("messages").insertOne(message);
    res.sendStatus(201);
    
    console.log(err);
    res.sendStatus(500);
  
  }catch{
res.sendStatus(400)
}
});

app.get("/messages", async (req, res) => {
  const limit = req.query.limit;

  let messages = [];

  try {
    if (limit) {
      messages = (await db.colletion("messages").find().sort({time:-1}).limit(limit)
        .toArray()).reverse();
    } else {
      messages = await db.collection("messages").find().toArray();
    }

    res.send(messages);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("Running in port 5000")
})