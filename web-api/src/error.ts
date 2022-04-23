import { NextFunction, Request, Response } from "express";

type errorData = {
  [key: string]: any;
};

class HttpException extends Error {
  statusCode?: number;
  message: string;
  data: errorData;
  constructor(statusCode: number, message: string, data?: errorData) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message;
    this.data = data ? { ...data } : {};
  }
}

export const badRequestException = (
  message = "400 Bad Request",
  data?: errorData
): HttpException => {
  return new HttpException(400, message, data);
};

export const notFoundException = (
  message = "404 Not Found",
  data?: errorData
): HttpException => {
  return new HttpException(404, message, data);
};

export default function errorHandler(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errorObject = {
    message: err.message,
    error: {
      ...err.data,
    },
  };
  console.warn("error", errorObject);
  res.status(err.statusCode || 500).send(errorObject);
}
