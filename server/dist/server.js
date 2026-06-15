"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const port = env_1.env.PORT || 4000;
app_1.default.listen(port, () => {
    console.log(`[Tamil Nadu Grocery-Med Server] Running on http://localhost:${port}`);
    console.log(`[Mode] ${process.env.NODE_ENV || 'development'}`);
});
