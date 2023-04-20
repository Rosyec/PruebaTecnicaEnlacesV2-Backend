import express, { Express } from "express";
import cors from 'cors';
import dotenv from "dotenv";

const app: Express = express();

dotenv.config();

const PORT = process.env.PORT;

app.set("PORT", PORT);

app.use(express.json());

app.use(cors());

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});