import dotenv from "dotenv"

dotenv.config()

const apiLogin = (process.env!.DB_API_LOGIN || '').split(':')
const apiCreds = { user: apiLogin[0], pass: apiLogin[1] }

const config = {
    shopDomain: process.env!.SHOP_DOMAIN,
    apiKey: process.env!.SHOPIFY_API_KEY,
    apiSecret: process.env!.SHOPIFY_API_SECRET_KEY,
    host: process.env!.HOST,
    port: process.env!.PORT || 3000,
    scopes: process.env!.SCOPES,
    tokenType: 'offline',
    ...apiCreds,
}

export default config as Record<keyof typeof config, string>

