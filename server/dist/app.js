"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const error_1 = require("./middleware/error");
// Import Routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const addresses_routes_1 = __importDefault(require("./modules/addresses/addresses.routes"));
const categories_routes_1 = __importDefault(require("./modules/categories/categories.routes"));
const products_routes_1 = __importDefault(require("./modules/products/products.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/cart.routes"));
const prescriptions_routes_1 = __importDefault(require("./modules/prescriptions/prescriptions.routes"));
const orders_routes_1 = __importDefault(require("./modules/orders/orders.routes"));
const payments_routes_1 = __importDefault(require("./modules/payments/payments.routes"));
const coupons_routes_1 = __importDefault(require("./modules/coupons/coupons.routes"));
const delivery_routes_1 = __importDefault(require("./modules/delivery/delivery.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const newsletter_routes_1 = __importDefault(require("./modules/newsletter/newsletter.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({ origin: '*' })); // Allow requests from all origins (Vite frontend)
app.use(express_1.default.json());
// Serve uploads statically
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes Mount (Base Path: /api/v1)
const basePrefix = '/api/v1';
app.use(`${basePrefix}/auth`, auth_routes_1.default);
app.use(`${basePrefix}/addresses`, addresses_routes_1.default);
app.use(`${basePrefix}/categories`, categories_routes_1.default);
app.use(`${basePrefix}/products`, products_routes_1.default);
app.use(`${basePrefix}/cart`, cart_routes_1.default);
app.use(`${basePrefix}/prescriptions`, prescriptions_routes_1.default);
app.use(`${basePrefix}/orders`, orders_routes_1.default);
app.use(`${basePrefix}/payments`, payments_routes_1.default);
app.use(`${basePrefix}/coupons`, coupons_routes_1.default);
app.use(`${basePrefix}/delivery-slots`, delivery_routes_1.default);
app.use(`${basePrefix}/admin`, admin_routes_1.default);
app.use(`${basePrefix}/newsletter`, newsletter_routes_1.default);
// Root Healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});
// Global Error Handler
app.use(error_1.errorHandler);
exports.default = app;
