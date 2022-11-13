import { NextFunction, Request, Response } from "express";

import { logger } from "../util/logger";
import {AppDataSource} from "./data-source";
import {User} from "../models/user";
import {calculatePasswordHash} from "../util/utils";
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

export async function login(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {email, password} = request.body;
    if (!email){
      throw 'email not provided'
    }
    if (!password){
      throw 'password not provided'
    }
    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("users")
      .where("email = :email", {email})
      .getOne()
    if (!user){
      const message = `Login denied`;
      logger.info(`${message}-${email}`)
      response.status(403).json({message});
      return;
    }

    const hash = await calculatePasswordHash(password,user.passwordSalt)
    if (hash !== user.passwordHash){
      const message = `Login denied`;
      logger.info(`${message}- user with ${email} has entered wrong password`)
      response.status(403).json({message});
      return;
    }
    logger.info(`User ${email} logged in `)
    const {pictureUrl, isAdmin} = user;

    const authJwt = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    }

    const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);

    response.status(200).json({
      user: {
        email,
        pictureUrl,
        isAdmin
      },
      authJwtToken
    })


  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
