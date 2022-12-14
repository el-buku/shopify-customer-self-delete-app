"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopify_api_1 = require("@shopify/shopify-api");
const shopify_1 = require("../services/shopify");
const config_1 = __importDefault(require("../config"));
const db_1 = require("../services/db");
const install = async (req, res) => {
    try {
        const { shop } = req.query;
        if (shop && typeof shop === 'string') {
            console.log("New OAuth process begining.");
            console.log(req.headers.host);
            await shopify_1.shopify.auth.begin({ rawRequest: req, rawResponse: res, shop, callbackPath: `/install/callback`, isOnline: config_1.default.tokenType === 'online' });
        }
        else {
            res.status(500).end(`Failed to complete OAuth process: shop not found`);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500);
        if (e instanceof shopify_api_1.ShopifyError) {
            res.end(e.message);
        }
        else {
            res.end(`Failed to complete OAuth process: install err`);
        }
    }
};
const callback = async (req, res) => {
    try {
        const { session } = await shopify_1.shopify.auth.callback({ isOnline: config_1.default.tokenType === 'online', rawRequest: req, rawResponse: res });
        console.log('session', session);
        if (session && session.accessToken) {
            console.log('OAuth callback validated.');
            let redirectUrl = `/?shop=${session.shop}&host=${req.query.host}`;
            const adminClient = (0, shopify_1.getAdminClient)(session.shop, session.accessToken);
            const createStorefrontTokenMutation = `
            mutation {
                storefrontAccessTokenCreate(
                  input: {title: "customersSelfDeleteApp_storefrontToken"}
                ) {
                  storefrontAccessToken {
                    accessToken
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }

            `;
            const { data: { storefrontAccessTokenCreate } } = await adminClient.query(createStorefrontTokenMutation);
            const storefrontAccessToken = storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken;
            db_1.TokenDBClient.saveResource({ shop: session.shop, token: session.accessToken, storefrontAccessToken });
            console.log('OAuth process completed.');
            res.redirect(redirectUrl);
        }
        else {
            res.status(500).end(`Failed to complete OAuth process: missingToken`);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500);
        if (e instanceof shopify_api_1.ShopifyError) {
            res.end(e.message);
        }
        else {
            res.end(`Failed to complete OAuth process: callback`);
        }
    }
};
exports.default = {
    install,
    callback
};
