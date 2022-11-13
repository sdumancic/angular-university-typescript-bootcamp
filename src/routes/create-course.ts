import {NextFunction, Request, Response} from "express";
import {logger} from "../util/logger";
import {AppDataSource} from "./data-source";
import {Course} from "../models/course";
import {Lesson} from "../models/lesson";

export async function createCourse(request: Request,
                                   response: Response,
                                   next: NextFunction){
  try{
    logger.debug('createCourse');

    const data = request.body;

    if (!data){
      throw 'No data available'
    }

    const course = await AppDataSource.manager.transaction("REPEATABLE READ",
      async(transactionalEntityManager) => {

      const repository = transactionalEntityManager.getRepository(Course);

        const result = await repository
          .createQueryBuilder("courses")
          .select("MAX(courses.seqNo)", 'max')
          .getRawOne()

        const course = repository
          .create({
            ...data,
            seqNo: (result?.max ?? 0) +1
          });

        await repository.save(course);

        return course;
      }
    )

    response.status(201).json({
      course
    })
  }
  catch (error){
    logger.error(error);
    return next(error);
  }
}