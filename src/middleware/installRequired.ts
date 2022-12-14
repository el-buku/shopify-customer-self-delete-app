import express from 'express';
import { AppAuth } from '../controllers';
import { TokenDBClient } from '../services';
import { TShopData } from '../services/db';


export const installRequired = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { shop } = req.query as Record<string, string>;
    const resources = await TokenDBClient.getData() as TShopData[]
    const shopData = (resources || []).find((resource) => resource.shop === shop);

    if (shopData) {
        res.locals.shopData = shopData;
        return next();
    } else {
        AppAuth.install(req, res, next)
    }
};
