"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/config/db.ts
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
