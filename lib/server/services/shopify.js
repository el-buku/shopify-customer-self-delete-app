"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminClient = exports.getStfClient = exports.shopify = void 0;
const shopify_api_1 = require("@shopify/shopify-api");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../config"));
exports.shopify = (0, shopify_api_1.shopifyApi)({ apiKey: config_1.default.apiKey, apiSecretKey: config_1.default.apiSecret, scopes: [config_1.default.scopes], hostName: config_1.default.host, isEmbeddedApp: false, apiVersion: shopify_api_1.ApiVersion.July22 });
const getStfClient = (storefrontAccessToken, shop) => (new exports.shopify.clients.Storefront({ storefrontAccessToken, domain: shop }));
exports.getStfClient = getStfClient;
const getAdminClient = (shopDomain, accessToken) => ({
    query: async (queryStr) => {
        const r = await (0, node_fetch_1.default)(`https://${shopDomain}/admin/api/2022-10/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/graphql',
                'X-Shopify-Access-Token': accessToken,
            },
            body: queryStr,
        });
        return await r.json();
    }
});
exports.getAdminClient = getAdminClient;
