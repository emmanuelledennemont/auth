import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

// Charger les variables d'environnement depuis le fichier .env
config({
  path: "../../env",
});

export const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
});

async function getObjectUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
}

const init = async () => {
  try {
    console.log("get URL for logo.svg ", await getObjectUrl("logo.svg"));
  } catch (error) {
    console.error("Error getting URL:", error);
  }
};

// init();
