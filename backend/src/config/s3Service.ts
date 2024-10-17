// s3Service.ts
import { S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// AWS S3 Configuration
const bucketName = process.env.BUCKET_NAME as string
const bucketRegion = process.env.BUCKET_REGION as string
const accessKey = process.env.ACCESS_KEY as string
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

// Function to upload a file to S3
async function uploadFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName, // Name of the file in S3
    Body: fileStream,
  };

  try {
    const result = await s3.send(new PutObjectCommand(uploadParams));
    console.log('File uploaded successfully:', result);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Other S3 functions (like download, list, delete) can be added here

export { uploadFile };
