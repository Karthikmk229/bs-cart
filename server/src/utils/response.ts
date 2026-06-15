// src/utils/response.ts
import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errors: any[] | null;
}

export function sendSuccess<T = any>(res: Response, data: T, message: string = 'Operation successful', statusCode: number = 200) {
  const responseBody: ApiResponse<T> = {
    success: true,
    data,
    message,
    errors: null,
  };
  return res.status(statusCode).json(responseBody);
}

export function sendError(res: Response, message: string = 'An error occurred', errors: any[] | null = null, statusCode: number = 400) {
  const responseBody: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    errors,
  };
  return res.status(statusCode).json(responseBody);
}
