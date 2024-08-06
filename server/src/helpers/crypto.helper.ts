import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET_KEY || "";

const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export default {
  random,
  authentication,
};
