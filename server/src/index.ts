import { seedUsers } from "@/seeders/users.seeder";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import router from "./router/index";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const MONGO_URL = process.env.MONGO_CONNECTION_STRING || "";
const PORT = process.env.PORT || 3000;
mongoose.Promise = Promise;

mongoose
  .connect(MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("🍃 MongoDB connected successfully");

    // Appeler la fonction de seed après la connexion à MongoDB
    await seedUsers();

    server.listen(PORT, () => {
      console.log("🚀 Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

mongoose.connection.on("error", (error) =>
  console.error("MongoDB error:", error)
);

app.use("/", router());
