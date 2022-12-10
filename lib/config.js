"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiLogin = (process.env.DB_API_LOGIN || '').split(':');
const apiCreds = { user: apiLogin[0], pass: apiLogin[1] };
const config = Object.assign({ shopDomain: process.env.SHOP_DOMAIN, apiKey: process.env.SHOPIFY_API_KEY, apiSecret: process.env.SHOPIFY_API_SECRET_KEY, accessToken: process.env.SHOPIFY_ACCESS_TOKEN, storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN, host: process.env.HOST, port: process.env.PORT || 3000, scopes: process.env.SCOPES }, apiCreds);
exports.default = config;
