import Shopify, { ApiVersion, shopifyApi, } from '@shopify/shopify-api';
import fetch from 'node-fetch';
import config from '../config';



export const shopify = shopifyApi({ apiKey: config.apiKey, apiSecretKey: config.apiSecret, scopes: [config.scopes], hostName: config.host, isEmbeddedApp: false, isPrivateApp: true, apiVersion: ApiVersion.July22 });

export const stfClient = new shopify.clients.Storefront({ storefrontAccessToken: config.storefrontAccessToken, domain: config.shopDomain });
export const adminClient = {
    query: async (queryStr: string) => {
        const r = await fetch(`https://${config.shopDomain}/admin/api/2022-10/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/graphql',
                'X-Shopify-Access-Token': config.accessToken,
            },
            body: queryStr,
        })
        return await r.json()
    }
}
