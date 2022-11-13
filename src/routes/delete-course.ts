import { NextFunction, Request, Response } from "express";
import { logger } from "../util/logger";
import { AppDataSource } from "./data-source";
import { Course } from "../models/course";
import { Lesson } from "../models/lesson";
import { isInteger } from "../util/utils";

export async function deleteCourseAndLessons(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug("deleteCourseAndLessons");

    const courseId = request.params.courseId;

    if (isInteger(courseId)) {
      throw "Invalid course id";
    }

    const course = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Lesson)
          .where("courseId = :courseId", { courseId })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Course)
          .where("id = :courseId", { courseId })
          .execute();
      }
    );

    response.status(204).json('Course deleted successfully')


  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
