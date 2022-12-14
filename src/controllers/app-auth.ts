import { RequestHandler } from 'express';
import { ShopifyError } from '@shopify/shopify-api';
import { getAdminClient, shopify } from '../services/shopify';
import config from '../config';
import { TokenDBClient } from '../services/db';

const install: RequestHandler = async (req, res) => {
    try {
        const { shop } = req.query;
        if (shop && typeof shop === 'string') {
            console.log("New OAuth process begining.")
            console.log(req.headers.host)
            await shopify.auth.begin({ rawRequest: req, rawResponse: res, shop, callbackPath: `/install/callback`, isOnline: config.tokenType === 'online' })
        } else {
            res.status(500).end(`Failed to complete OAuth process: shop not found`);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500);
        if (e instanceof ShopifyError) {
            res.end(e.message);
        }
        else {
            res.end(`Failed to complete OAuth process: install err`);
        }
    }
}

const callback: RequestHandler = async (req, res) => {
    try {
        const { session } = await shopify.auth.callback({ isOnline: config.tokenType === 'online', rawRequest: req, rawResponse: res })
        console.log('session', session)
        if (session && session.accessToken) {
            console.log('OAuth callback validated.')
            let redirectUrl = `/?shop=${session.shop}&host=${req.query.host}`;

            const adminClient = getAdminClient(session.shop, session.accessToken)
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

            `
            const { data: { storefrontAccessTokenCreate } } = await adminClient.query(createStorefrontTokenMutation)
            const storefrontAccessToken = storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken
            TokenDBClient.saveResource({ shop: session.shop, token: session.accessToken, storefrontAccessToken })
            console.log('OAuth process completed.')
            res.send(`<script>location.assign("${redirectUrl}")</script>`)
        } else {
            res.status(500).end(`Failed to complete OAuth process: missingToken`);
        }
    }
    catch (e) {
        console.log(e);

        res.status(500);
        if (e instanceof ShopifyError) {
            res.end(e.message);
        }
        else {
            res.end(`Failed to complete OAuth process: callback`);
        }
    }
}

export default {
    install,
    callback
}
