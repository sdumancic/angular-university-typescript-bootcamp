import { NextFunction, Request, Response } from "express";
import { logger } from "../util/logger";
import { AppDataSource } from "./data-source";
import { User } from "../models/user";
import {calculatePasswordHash} from "../util/utils";
const crypto = require("crypto")

export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction
) {

  try {
    const { email, pictureUrl, password, isAdmin } = request.body;
    if (!email) {
      throw "email is mandatory";
    }
    if (!password) {
      throw "password is mandatory";
    }
    const repository = AppDataSource.getRepository(User);
    const user = await repository
      .createQueryBuilder("users")
      .where("email = :email", { email })
      .getOne();
    if (user) {
      const message= "User with given email already exists, aborting";
      response
        .status(500)
        .json(message);
      return;
    }

    const passwordSalt = crypto.randomBytes(64).toString("hex");
    const passwordHash = await calculatePasswordHash(password, passwordSalt);
    const newUser = repository.create({email, pictureUrl, isAdmin, passwordHash, passwordSalt});
    await AppDataSource.manager.save(newUser);
    logger.info('new user created');
    response.status(201).json({
      email, pictureUrl, isAdmin
    })

  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
