import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

export const BUCKET_NAME =
  process.env.AWS_S3_BUCKET_NAME || "default-bucket-name";
export const CLOUDFRONT_URL =
  process.env.AWS_CLOUDFRONT_URL || "https://default-cloudfront-url.com";
export const CLOUDFRONT_KEY_PAIR_ID =
  process.env.AWS_CLOUDFRONT_KEY_PAIR_ID || "default-key-pair-id";
export const CLOUDFRONT_PRIVATE_KEY_PATH =
  process.env.AWS_CLOUDFRONT_PRIVATE_KEY_PATH ||
  "/path/to/default/private/key.pem";
