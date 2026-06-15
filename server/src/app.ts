// src/app.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/error';

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import addressesRoutes from './modules/addresses/addresses.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import productsRoutes from './modules/products/products.routes';
import cartRoutes from './modules/cart/cart.routes';
import prescriptionsRoutes from './modules/prescriptions/prescriptions.routes';
import ordersRoutes from './modules/orders/orders.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import couponsRoutes from './modules/coupons/coupons.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import adminRoutes from './modules/admin/admin.routes';
import newsletterRoutes from './modules/newsletter/newsletter.routes';

const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // Allow requests from all origins (Vite frontend)
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes Mount (Base Path: /api/v1)
const basePrefix = '/api/v1';
app.use(`${basePrefix}/auth`, authRoutes);
app.use(`${basePrefix}/addresses`, addressesRoutes);
app.use(`${basePrefix}/categories`, categoriesRoutes);
app.use(`${basePrefix}/products`, productsRoutes);
app.use(`${basePrefix}/cart`, cartRoutes);
app.use(`${basePrefix}/prescriptions`, prescriptionsRoutes);
app.use(`${basePrefix}/orders`, ordersRoutes);
app.use(`${basePrefix}/payments`, paymentsRoutes);
app.use(`${basePrefix}/coupons`, couponsRoutes);
app.use(`${basePrefix}/delivery-slots`, deliveryRoutes);
app.use(`${basePrefix}/admin`, adminRoutes);
app.use(`${basePrefix}/newsletter`, newsletterRoutes);

// Root Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

export default app;
