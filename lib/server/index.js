"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@shopify/shopify-api/adapters/node");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const { port } = config_1.default;
const controllers_1 = require("./controllers");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.all("/*", (0, cors_1.default)({ credentials: true }));
app.get('/install', controllers_1.AppAuth.install);
app.get('/install/callback', controllers_1.AppAuth.callback);
app.get('/delete/:timestamp', middleware_1.installRequired, controllers_1.Customer.deleteCustomer);
app.get('/history', middleware_1.authRoute, controllers_1.Customer.getRecords);
app.get('/', middleware_1.installRequired, controllers_1.Core.adminApp);
app.listen(port || 3000, function () {
    console.log('Shopify admin app listening on http://localhost:%s', port);
});
