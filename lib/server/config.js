"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiLogin = (process.env.DB_API_LOGIN || '').split(':');
const apiCreds = { user: apiLogin[0], pass: apiLogin[1] };
const config = {
    shopDomain: process.env.SHOP_DOMAIN,
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecret: process.env.SHOPIFY_API_SECRET_KEY,
    host: process.env.HOST,
    port: process.env.PORT || 3000,
    scopes: process.env.SCOPES,
    tokenType: 'offline',
    ...apiCreds,
};
exports.default = config;
