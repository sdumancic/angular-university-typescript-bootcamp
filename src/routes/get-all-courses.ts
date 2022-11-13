import { NextFunction, Request, Response } from "express";
import { logger } from "../util/logger";
import { AppDataSource } from "./data-source";
import { Course } from "../models/course";

export async function getAllCourses(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug("Called getAllCourses");
    const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder("courses")
      .leftJoinAndSelect("courses.lessons", "lessons")
      .orderBy("courses.seqNo")
      .getMany();

    response.status(200).json({ courses });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
