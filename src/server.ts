import * as dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import { isInteger } from "./util/utils";
import { logger } from "./util/logger";
const result = dotenv.config();
import { AppDataSource } from "./routes/data-source";
import {root} from "./routes/root";
import {getAllCourses} from "./routes/get-all-courses";
import {defaultErrorHandler} from "./middleware/default-error-handler";
import {findCourseByUrl} from "./routes/find-course-by-url";
import {findLessonsForCourse} from "./routes/find-lessons-for-course";
import {updateCourse} from "./routes/update-course";
import {createCourse} from "./routes/create-course";
import {deleteCourseAndLessons} from "./routes/delete-course";
import {createUser} from "./routes/create-user";
import {login} from "./routes/login";
import {checkIfAuthenticated} from "./middleware/authentication-middleware";
import {checkIfAdmin} from "./middleware/admin-only";

const cors = require('cors')

const bodyParser = require("body-parser")

if(result.error){
    console.log('error loading environment variables, aborting')
    process.exit(1)
}

const app = express();


function setupExpress() {
    app.use(express.json());
    app.use(cors({origin:true}))
    app.use(bodyParser.json())
    app.route("/").get(root)
    app.route('/api/courses').get(checkIfAuthenticated,getAllCourses)
    app.route('/api/courses/:courseUrl').get(checkIfAuthenticated,findCourseByUrl)
    app.route('/api/courses/:courseId/lessons').get(checkIfAuthenticated,findLessonsForCourse)
    app.route('/api/users').post(checkIfAuthenticated,checkIfAdmin, createUser)
    app.route('/api/courses/:courseId').patch(checkIfAuthenticated,updateCourse)
    app.route('/api/courses').post(checkIfAuthenticated,createCourse)
    app.route('/api/courses/:courseId').delete(checkIfAuthenticated,deleteCourseAndLessons)
    app.route('/api/login').post(login)
    app.use(defaultErrorHandler);
}

function startServer(){
    let port: number|undefined;
    const portEnv = process.env.PORT,
        portArg = process.argv[2]

    if (portEnv && isInteger(portEnv)){
        port = parseInt(portEnv)
    } else if (portArg && isInteger(portArg)){
        port = parseInt(portArg)
    } else {
        port = 9000
    }


    app.listen(port, () => {
        logger.info(`HTTP Rest api server is running on http://localhost:${port}`)
    })
}


AppDataSource.initialize()
    .then( () => {
        logger.info('The datasource has been initialized')
        setupExpress()
        logger.info('Express has been initialized')
        startServer()
    })
    .catch(err => {
        logger.error('Error during datasource initialization ',err)
        process.exit(1)
    })