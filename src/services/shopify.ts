import Shopify, { ApiVersion, shopifyApi, } from '@shopify/shopify-api';
import fetch from 'node-fetch';
import config from '../config';

export const shopify = shopifyApi({ apiKey: config.apiKey, apiSecretKey: config.apiSecret, scopes: [config.scopes], hostName: config.host, isEmbeddedApp: false, apiVersion: ApiVersion.July22 });

export const getStfClient = (shopDomain: string, storefrontAccessToken: string) => (new shopify.clients.Storefront({ storefrontAccessToken, domain: shopDomain }));
export const getAdminClient = (shopDomain: string, accessToken: string) => ({
    query: async (queryStr: string) => {
        const r = await fetch(`https://${shopDomain}/admin/api/2022-10/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/graphql',
                'X-Shopify-Access-Token': accessToken,
            },
            body: queryStr,
        })
        return await r.json()
    }
}
)
