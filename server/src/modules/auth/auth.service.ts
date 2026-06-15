// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

// Memory store for OTPs: key = phone, value = { code, expiresAt, lastSent }
const otpStore = new Map<string, { code: string; expiresAt: Date; lastSent: Date }>();

export class AuthService {
  static async sendOtp(phone: string): Promise<{ message: string; testOtp?: string }> {
    const now = new Date();
    const existing = otpStore.get(phone);

    // Rate limiting: 30 seconds cooldown between OTP requests
    if (existing && now.getTime() - existing.lastSent.getTime() < 30000) {
      throw new Error('Please wait 30 seconds before requesting a new OTP');
    }

    // Generate 4-digit code (for testing, we can generate a fixed code or log a random one)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes validity

    otpStore.set(phone, { code, expiresAt, lastSent: now });

    // Mock Twilio SMS Send
    console.log(`[Twilio SMS Stub] Sending OTP ${code} to ${phone}`);

    // Return the test OTP in development mode so developers can easily test without checking server logs
    return {
      message: 'OTP sent successfully',
      testOtp: process.env.NODE_ENV === 'production' ? undefined : code,
    };
  }

  static async verifyOtp(phone: string, code: string, name?: string, email?: string) {
    const record = otpStore.get(phone);
    if (!record) {
      throw new Error('No OTP requested for this phone number');
    }

    if (new Date() > record.expiresAt) {
      otpStore.delete(phone);
      throw new Error('OTP has expired');
    }

    if (record.code !== code) {
      throw new Error('Invalid OTP code');
    }

    // OTP verified successfully, clear it from memory
    otpStore.delete(phone);

    // Fetch user or create if not exists
    let user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      // Create a default name and email if not provided
      const userEmail = email || `user_${Date.now()}@tnmarket.in`;
      const userName = name || 'Tamil Nadu Customer';
      
      // Since it's a new customer, they don't need a password hash originally, but we can set a dummy one
      const dummyPasswordHash = await bcrypt.hash(Math.random().toString(36), 10);

      user = await prisma.user.create({
        data: {
          phone,
          email: userEmail,
          name: userName,
          passwordHash: dummyPasswordHash,
          role: 'customer',
        },
      });

      // Initialize their cart
      await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    // Hash and store refresh token
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async adminLogin(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.role !== 'admin' && user.role !== 'delivery_partner') {
      throw new Error('Access denied: Staff login only');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Staff account is deactivated');
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.userId,
        revoked: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new Error('Refresh token revoked or expired');
    }

    // Verify hashed token
    const isMatch = await bcrypt.compare(refreshToken, tokenRecord.tokenHash);
    if (!isMatch) {
      throw new Error('Refresh token verification failed');
    }

    // Generate new access token
    const accessToken = generateAccessToken({ userId: payload.userId, role: payload.role });
    return { accessToken };
  }

  static async logout(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return; // If it's invalid, just return
    }

    // Revoke all tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId: payload.userId },
      data: { revoked: true },
    });
  }
}
