import * as dotenv from 'dotenv';
const result  = dotenv.config();
import "reflect-metadata"
import {AppDataSource} from "../routes/data-source";
import {Course} from "./course";
import {Lesson} from "./lesson";
import {User} from "./user";

async function deleteDb(){

    await AppDataSource.initialize();
    console.log('DB connection ready')

    const courseRepo = AppDataSource.getRepository(Course);
    const lessonsRepo = AppDataSource.getRepository(Lesson);
    const usersRepo = AppDataSource.getRepository(User);

    await lessonsRepo.delete({})
    await courseRepo.delete({})
    await usersRepo.delete({})

}

deleteDb()
    .then(() => {
        console.log('finish deleting db')
        process.exit(0)
    })
    .catch(err => {
        console.log('error while deleting db ',err)
        process.exit(1)
    })

