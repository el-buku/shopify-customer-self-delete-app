"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const basic_auth_1 = __importDefault(require("basic-auth"));
const cors_1 = __importDefault(require("cors"));
require("@shopify/shopify-api/adapters/node");
const config_1 = __importDefault(require("./config"));
const { host, port } = config_1.default;
const services_1 = require("./services");
const app = (0, express_1.default)();
app.all("/*", (0, cors_1.default)({ credentials: true, origin: true }));
const authRoute = (req, res, next) => {
    const user = (0, basic_auth_1.default)(req);
    if (!user || user.name !== config_1.default.user || user.pass !== config_1.default.pass) {
        res.set('WWW-Authenticate', 'Basic realm="self-delete-app"');
        return res.status(401).send();
    }
    return next();
};
app.use(body_parser_1.default.json());
app.post('/delete', async function (req, res) {
    const { customerEmail, password, customerId } = req.body;
    // get shopify customer id
    const customerIdQuery = `query{
        customers(first: 10, query: "${customerEmail}"){
        edges{
          node {
            id
            email
            firstName
          }
        }
      }
    }`;
    const { data: { customers: { edges } } } = await services_1.adminClient.query(customerIdQuery);
    const { node: { id } } = edges[0];
    console.log(edges);
    const queriedId = id === null || id === void 0 ? void 0 : id.split('/').slice(-1)[0];
    // log customer in and check his account
    const mutation = `mutation { customerAccessTokenCreate(input: {email: "${customerEmail}", password: "${password}"}) { customerAccessToken { accessToken, expiresAt }, customerUserErrors { code } } }`;
    const customerLoginMutation = { data: mutation };
    const { body: { data: { customerAccessTokenCreate: { customerAccessToken, customerUserErrors } } } } = await services_1.stfClient.query(customerLoginMutation);
    console.log(`Customer access token: %s`, customerAccessToken);
    console.log(customerId, queriedId, id);
    if (!!customerAccessToken && customerId === queriedId) {
        try {
            //delete customer using admin client
            const customerDeleteMutation = `mutation {
      customerDelete(input: {id: "${queriedId}"}){
        deletedCustomerId
        }
      }`;
            const { data: { customerDelete: { deletedCustomerId } } } = await services_1.adminClient.query(customerDeleteMutation);
            console.log(`Deleted customer with id ${deletedCustomerId}`);
            services_1.dbClient.saveResource({ customerId: deletedCustomerId, status: "SUCCESS" });
            res.status(200);
        }
        catch (e) {
            services_1.dbClient.saveResource({ customerId: customerId, status: "FAILED" });
            res.status(500).send({ err: true });
        }
    }
    else if (customerId != queriedId) {
        console.log("Customer ID does not match");
        // dbClient.saveResource({ customerId: customerId, status: "FAILED" })
        res.status(400).send({ err: true });
    }
    else {
        console.log("Wrong password");
        res.status(405).send({ err: true });
    }
});
app.get('/deletedCustomers', authRoute, async function (req, res) {
    const data = await services_1.dbClient.getData();
    console.log(data);
    res.json(data);
});
app.get('/', function (req, res) { res.send('hello'); });
var server = app.listen(port || 3000, function () {
    console.log('Shopify admin app listening on http://localhost:%s', port);
});
