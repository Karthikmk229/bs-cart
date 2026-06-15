// src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';

export class AuthController {
  static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      const result = await AuthService.sendOtp(phone);
      return sendSuccess(res, result, 'OTP code sent');
    } catch (error: any) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, code, name, email } = req.body;
      const result = await AuthService.verifyOtp(phone, code, name, email);
      return sendSuccess(res, result, 'OTP verified successfully');
    } catch (error: any) {
      next(error);
    }
  }

  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.adminLogin(email, password);
      return sendSuccess(res, result, 'Staff logged in successfully');
    } catch (error: any) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refresh(refreshToken);
      return sendSuccess(res, result, 'Access token refreshed');
    } catch (error: any) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
