import {NextFunction, Request, Response} from "express";
import {logger} from "../util/logger";
import {AppDataSource} from "./data-source";
import {Course} from "../models/course";
import {Lesson} from "../models/lesson";

export async function updateCourse(request: Request,
                                   response: Response,
                                   next: NextFunction){
  try{
    logger.debug('findCourseByUrl');

    const courseId = request.params.courseId
    const changes = request.body;

    const course = await AppDataSource
      .createQueryBuilder()
      .update(Course)
      .set(changes)
      .where("id = :courseId", {courseId})
      .execute()


    response.status(200).json({
      course
    })
  }
  catch (error){
    logger.error(error);
    return next(error);
  }
}