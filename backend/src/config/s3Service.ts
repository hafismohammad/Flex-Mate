// s3Service.ts
import { S3Client} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv'
dotenv.config()

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

export { s3, bucketName, Upload };
