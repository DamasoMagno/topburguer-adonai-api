import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
  PORT: z.coerce.number().min(1, { message: "PORT is required" }).default(3000),
  HOST: z.string().min(1, { message: "HOST is required" }).default("0.0.0.0"),
  SECRET_KEY: z.string().min(1, { message: "SECRET_KEY is required" }),
});

export const env = envSchema.parse(process.env);
