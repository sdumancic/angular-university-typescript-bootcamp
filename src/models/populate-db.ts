import * as dotenv from "dotenv";

const result = dotenv.config();
import "reflect-metadata";
import { COURSES, USERS } from "./dbdata";
import { AppDataSource } from "../routes/data-source";
import { Course } from "./course";
import { DeepPartial } from "typeorm";
import { Lesson } from "./lesson";
import { getConnection } from "typeorm";
import { User } from "./user";
import {calculatePasswordHash} from "../util/utils";
const crypto = require('crypto')

async function populateDb() {
  await AppDataSource.initialize();
  console.log("DB connection ready");

  const courses = Object.values(COURSES) as DeepPartial<Course>[];
  const users = Object.values(USERS) as any[];
  const courseRepo = AppDataSource.getRepository(Course);
  const lessonsRepo = AppDataSource.getRepository(Lesson);
  const usersRepo = AppDataSource.getRepository(User);



  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  // 1 Course and all child lessons are inserted into single transaction
  /*
  for (let courseData of courses) {
    await queryRunner.startTransaction();
    try {
      const course = courseRepo.create(courseData);
      await queryRunner.manager.save(course);

      for (let lessonData of courseData.lessons!) {
        const lesson = lessonsRepo.create(lessonData);
        lesson.course = course;
        await queryRunner.manager.save(lesson);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    }
  }
*/
  await queryRunner.startTransaction();
  for (let userData of users) {

    const user = AppDataSource.getRepository(User)
      .create({
        email: userData.email,
        pictureUrl: userData.pictureUrl,
        isAdmin: userData.isAdmin,
        passwordSalt: userData.passwordSalt,
        passwordHash: await calculatePasswordHash(userData.plainTextPassword, userData.passwordSalt)
      })
    try {
      await queryRunner.manager.save(user);
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    }
  }
  await queryRunner.commitTransaction();

  await queryRunner.release();

  const totalCourses = await courseRepo.createQueryBuilder().getCount();
  const totalLessons = await lessonsRepo.createQueryBuilder().getCount();
  console.log(
    "Data inserted, total courses=",
    totalCourses,
    " total lessons ",
    totalLessons
  );
}

populateDb()
  .then(() => {
    console.log("finish populating db");
    process.exit(0);
  })
  .catch((err) => {
    console.log("error while populating db ", err);
    process.exit(1);
  });

