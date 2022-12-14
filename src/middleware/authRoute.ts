import express from 'express';
import config from '../config';
import basicAuth from "basic-auth";


export const authRoute = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = basicAuth(req);

    if (!user || user.name !== config.user || user.pass !== config.pass) {
        res.set('WWW-Authenticate', 'Basic realm="self-delete-app"');
        return res.status(401).send();
    }

    return next();
};
