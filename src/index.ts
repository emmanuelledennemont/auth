import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import router from "./router/index";
import { seedUsers } from "./seeders/users.seeder";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("🚀 Server is running on http://localhost:8080 🚀");

  // Appeler la fonction de seed au démarrage du serveur
  seedUsers();
});

const MONGO_URL = process.env.MONGO_CONNECTION_STRING || "";

mongoose.Promise = Promise;

mongoose.connect(MONGO_URL);

mongoose.connection.on("error", (error) => console.error(error));

app.use("/", router());
