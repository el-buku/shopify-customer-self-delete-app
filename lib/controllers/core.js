"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const shopify_1 = require("../services/shopify");
const getRecords = async function (req, res) {
    const data = await services_1.dbClient.getData();
    console.log(data);
    res.json(data);
};
const deleteCustomer = async function (req, res) {
    console.log(req.query.param);
    // const shopData = (await TokenDBClient.getData() as TShopData[] || []).find((resource) => resource.shop === shop)
    const shopData = res.locals.shopData;
    console.log(shopData, 'shopdataa');
    const { customerEmail, password, customerId, shop } = req.body;
    if (shopData) {
        const adminClient = (0, shopify_1.getAdminClient)(shopData?.shop, shopData?.token);
        console.log('1');
        const stfClient = (0, shopify_1.getStfClient)(shopData?.shop, shopData?.storefrontAccessToken);
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
        const { data: { customers: { edges } } } = await adminClient.query(customerIdQuery);
        const { node: { id } } = edges[0] || { node: {} };
        const queriedId = id?.split('/').slice(-1)[0];
        // log customer in and check his account
        const mutation = `mutation { customerAccessTokenCreate(input: {email: "${customerEmail}", password: "${password}"}) { customerAccessToken { accessToken, expiresAt }, customerUserErrors { code } } }`;
        const customerLoginMutation = { data: mutation };
        const { body: { data: { customerAccessTokenCreate: { customerAccessToken, customerUserErrors } } } } = await stfClient.query(customerLoginMutation);
        console.log(`Customer access token: %s`, customerAccessToken);
        console.log('sloboz, qu', queriedId);
        if (!!customerAccessToken && customerId === queriedId) {
            console.log(2, queriedId);
            try {
                const customerDeleteMutation = `mutation {
              customerDelete(input: {id: "gid://shopify/Customer/${queriedId}"}){
                deletedCustomerId
                }
              }`;
            console.log(3);
            const data = await adminClient.query(customerDeleteMutation);
            console.log(4, data);
            console.log(`Deleted customer with id ${deletedCustomerId}`)
            dbClient.saveResource({ customerId: deletedCustomerId, status: "SUCCESS" })
            res.status(200).send({ success: true });
            } catch (e) {
            dbClient.saveResource({ customerId: customerId, status: "FAILED" })
            res.status(500).send({ err: true })
            }
        }
        else if (customerId != queriedId) {
            console.log("Customer ID does not match");
            dbClient.saveResource({ customerId: customerId, status: "FAILED" })
            res.status(400).send({ err: true });
        }
        else {
            console.log("Wrong password");
            res.status(405).send({ err: true });
        }
    }
    else {
        console.log("shopData missing!");
        dbClient.saveResource({ customerId: customerId, status: "FAILED" })
        res.status(400).send({ err: true });
    }
};
exports.default = {
    deleteCustomer,
    getRecords
};
