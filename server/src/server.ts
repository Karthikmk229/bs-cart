// src/server.ts
import app from './app';
import { env } from './config/env';

const port = env.PORT || 4000;

app.listen(port, () => {
  console.log(`[Tamil Nadu Grocery-Med Server] Running on http://localhost:${port}`);
  console.log(`[Mode] ${process.env.NODE_ENV || 'development'}`);
});
