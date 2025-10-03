import { Response } from 'express';

export class ApiResponse {
  constructor(
    res: Response,
    statusCode: number,
    data: any = null,
    message: string = 'Success'
  ) {
    res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data
    });
  }
}