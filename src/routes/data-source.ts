import { DataSource } from "typeorm";
import { Course } from "../models/course";
import { Lesson } from "../models/lesson";
import { User } from "../models/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3456,
  database: process.env.DB_NAME,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [Course, Lesson, User],
  synchronize: false,
  logging: true,
});
