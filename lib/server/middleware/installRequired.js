"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installRequired = void 0;
const controllers_1 = require("../controllers");
const services_1 = require("../services");
const installRequired = async (req, res, next) => {
    const { shop } = req.query;
    const resources = await services_1.TokenDBClient.getData();
    const shopData = (resources || []).find((resource) => resource.shop === shop);
    if (shopData) {
        res.locals.shopData = shopData;
        return next();
    }
    else {
        controllers_1.AppAuth.install(req, res, next);
    }
};
exports.installRequired = installRequired;
