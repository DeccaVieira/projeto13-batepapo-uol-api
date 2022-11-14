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

const validation = participantSchema.validate(participant, {
  abortEarly: false,
});
app.post("/participants", async (req, res) => {
  const newUser = req.body;

  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    res.status(422).send(erros);
    return;
  }
  try {
    await participantSchema.validate(newUser, {
      abortEarly: false,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  const user = await db.collection("users").findOne({
    name: newUser.name,
  });

  if (user) {
    res.sendStatus(409);
    return;
  }

  if (!newUser.name) {
    res.sendStatus(422);
  }

  const userM = {
    from: newUser.name,
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    lastTime: dayjs().format("HH:mm:ss"),
    timeNow: Date.now(),
  };

  try {
    await db.collection("users").insertOne({
      ...newUser,
      lastStatus: Date.now(),
    });

    await db.collection("messages").insertOne({
      ...userM,
    });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/participants", async (req, res) => {
  participant = req.headers.participant;
  try {
    participants = await db.collection("users").find().toArray();
    res.send(participants);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().pattern(/^(private_message|message)$/),
  lastTime: joi.any(),
  timeNow: joi.any(),
});

app.post("/messages", async (req, res) => {
  const message = req.body;
  const validation = messageSchema.validate(message, { abortEarly: false });

  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    res.status(422).send(erros);
    return;
  }
  try {
    await db.collection("messages").insertOne(message);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/messages", async (req, res) => {
  const limit = req.query;

  if (limit) {
  }
  try {
    const messages = await db.collection("messages").find().toArray();
    res.send(messages);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log("Running in port 5000");
});
