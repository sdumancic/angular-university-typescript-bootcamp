import {NextFunction, Request, Response} from "express";
import {logger} from "../util/logger";

export function checkIfAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const headers = response.getHeaders();
  const isAdmin = headers['is-admin']

  if (!isAdmin){
    logger.error('User is not admin');
    response.sendStatus(403)
    return;
  }

  logger.info('user is admin, access granted')
  next();
}