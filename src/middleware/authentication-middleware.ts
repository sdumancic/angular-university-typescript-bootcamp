import {NextFunction, Request, Response} from "express";
import {logger} from "../util/logger";
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

export function checkIfAuthenticated(  request: Request, response: Response, next: NextFunction){
  const authJwtToken = request.headers.authorization;
  if (!authJwtToken){
    logger.info('JWT was not present, access denied')
    response.sendStatus(403)
    return;
  }

  checkJwtValidity(authJwtToken)
    .then( user => {
      logger.info('Successfully decoded JWT token ', user)
      // @ts-ignore


      response.setHeader('is-admin', user.isAdmin.toString());

    logger.info('ok')
      const headers = response.getHeaders();
      logger.info(JSON.stringify(headers));

      next();
    })
    .catch(error => {
      logger.error('Access denied', error)
      response.sendStatus(403);
    })

}

async function checkJwtValidity(authJwtToken: string){
  const token = authJwtToken.split(' ')[1];
  const user = await jwt.verify(token, JWT_SECRET)
  logger.info('Found user details ', user)
  return user;
}