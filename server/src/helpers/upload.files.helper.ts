import { s3Client } from "@/config/s3.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Définissez le type File en utilisant Express.Multer.File
type File = Express.Multer.File;

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const uploadImage = async (
  file: File,
  userId: string,
  width = 300,
  quality = 80
): Promise<UploadResult> => {
  try {
    // Optimiser l'image
    const optimizedImageBuffer = await sharp(file.buffer)
      .resize(width) // Redimensionner l'image
      .webp({ quality }) // Convertir en WebP pour une meilleure compression
      .toBuffer();

    const fileExtension = "webp"; // On utilise toujours WebP pour l'extension
    const fileName = `${userId}-${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-images/${fileName}`,
      Body: optimizedImageBuffer,
      ContentType: "image/webp",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/profile-images/${fileName}`;

    return { success: true, url: imageUrl };
  } catch (error) {
    console.error("Error uploading and optimizing image:", error);
    return { success: false, error: "Failed to upload and optimize image" };
  }
};

export default {
  uploadImage,
};
