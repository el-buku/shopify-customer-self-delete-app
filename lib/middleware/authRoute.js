"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const config_1 = __importDefault(require("../config"));
const basic_auth_1 = __importDefault(require("basic-auth"));
const authRoute = (req, res, next) => {
    const user = (0, basic_auth_1.default)(req);
    if (!user || user.name !== config_1.default.user || user.pass !== config_1.default.pass) {
        res.set('WWW-Authenticate', 'Basic realm="self-delete-app"');
        return res.status(401).send();
    }
    return next();
};
exports.authRoute = authRoute;
