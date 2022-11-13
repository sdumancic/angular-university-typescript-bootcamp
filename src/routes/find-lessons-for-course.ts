import {NextFunction, Request, Response} from "express";
import {logger} from "../util/logger";
import {isInteger} from "../util/utils";
import {AppDataSource} from "./data-source";
import {Course} from "../models/course";
import {Lesson} from "../models/lesson";

export async function findLessonsForCourse(request: Request,
                                           response: Response,
                                           next: NextFunction){
  try{
    logger.debug('findLessonsForCours')
    const courseId = request.params.courseId,
          query = request.query as any,
          pageNumber = query?.pageNumber ?? '0',
          pageSize = query?.pageSize ?? '5';
    if (!isInteger(courseId)){
      throw 'Invalid courseId';
    }
    if (!isInteger(pageNumber)){
      throw 'Invalid page number';
    }
    if (!isInteger(pageSize)){
      throw 'Invalid pageSize';
    }
    
    const lessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder("lessons")
      .where("lessons.courseId = :courseId", {courseId})
      .orderBy("lessons.seqNo")
      .take(pageSize)
      .skip(pageNumber * pageSize)
      .getMany();

    response.status(200).json({
      lessons
    })
      

  }
  catch(error){
    logger.error('error at findLessonsForCourse')
    return next(error)
  }
}