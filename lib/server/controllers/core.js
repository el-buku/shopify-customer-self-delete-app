"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const services_1 = require("../services");
const adminApp = async function (req, res) {
    const shopData = res.locals.shopData;
    if (shopData) {
        var redirectUrl = "https://" + shopData.shop + "/admin/apps/" + config_1.default.apiKey + req.originalUrl;
        const appData = await services_1.dbClient.getData();
        if (!req.query.shop) {
            console.log('OK');
            res.redirect(redirectUrl);
        }
        else {
            // yes, really
            res.send(`
            <!DOCTYPE html>
            <html>
                <body>
                    <h3>App is running!</h3>
                    <br/>
                    <br/>
                    <div>
                    ${appData}
                    </div>
                    <script>
                        if(window.location.host!=="${shopData.shop}")
                            window.location.assign("${redirectUrl}".trim())
                    </script>
                </body>
            </html>

            `);
        }
    }
    else {
        res.send('App is not installed.');
    }
};
exports.default = { adminApp };
