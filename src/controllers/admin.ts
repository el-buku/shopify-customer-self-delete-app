import { RequestHandler } from 'express';
import config from '../config';
import { displayJSON, displayJSONStyles } from '../helpers';
import { dbClient } from '../services';

const appIndex: RequestHandler = async function (req, res) {
    const shopData = res.locals.shopData
    if (shopData) {
        var redirectUrl = "https://" + shopData.shop + "/admin/apps/" + config.apiKey + req.originalUrl
        const appData = await dbClient.getData()
        if (!req.query.shop) {
            console.log('OK')
            res.redirect(redirectUrl)
        } else {
            // yes, really
            res.send(`
            <!DOCTYPE html>
            <html>
                <body>
                    <h3>App is running!</h3>
                    <br/>
                    <br/>
                    <div>
                    ${appData ? displayJSON(appData) : "No records"}
                    </div>
                    <script>
                        if(window===window.parent)
                            window.location.assign("${redirectUrl}".trim())
                    </script>
                    <style>${displayJSONStyles}</style>
                </body>
            </html>

            `)
        }

    } else {
        res.send('App is not installed.')
    }
}

export default { appIndex }
