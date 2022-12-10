"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminClient = exports.stfClient = exports.shopify = void 0;
const shopify_api_1 = require("@shopify/shopify-api");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../config"));
exports.shopify = (0, shopify_api_1.shopifyApi)({ apiKey: config_1.default.apiKey, apiSecretKey: config_1.default.apiSecret, scopes: [config_1.default.scopes], hostName: config_1.default.host, isEmbeddedApp: false, isPrivateApp: true, apiVersion: shopify_api_1.ApiVersion.July22 });
exports.stfClient = new exports.shopify.clients.Storefront({ storefrontAccessToken: config_1.default.storefrontAccessToken, domain: config_1.default.shopDomain });
exports.adminClient = {
    query: async (queryStr) => {
        const r = await (0, node_fetch_1.default)(`https://${config_1.default.shopDomain}/admin/api/2022-10/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/graphql',
                'X-Shopify-Access-Token': config_1.default.accessToken,
            },
            body: queryStr,
        });
        return await r.json();
    }
};
