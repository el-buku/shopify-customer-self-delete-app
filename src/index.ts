import express from 'express';
import bodyParser from 'body-parser';
import basicAuth from "basic-auth"
import cors from "cors"
import { GraphqlParams } from '@shopify/shopify-api/lib/clients/types';
import '@shopify/shopify-api/adapters/node';

import config from './config';
const { host, port } = config;

import { dbClient, adminClient, stfClient } from './services';

const app = express();

app.all("/*", cors({ credentials: true, origin: true }))
const authRoute = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = basicAuth(req);

  if (!user || user.name !== config.user || user.pass !== config.pass) {
    res.set('WWW-Authenticate', 'Basic realm="self-delete-app"');
    return res.status(401).send();
  }

  return next();
};


app.use(bodyParser.json());

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
    }`
  const { data: { customers: { edges } } } = await adminClient.query(customerIdQuery)
  const { node: { id } } = edges[0]
  console.log(edges)
  const queriedId = id?.split('/').slice(-1)[0]
  // log customer in and check his account
  const mutation = `mutation { customerAccessTokenCreate(input: {email: "${customerEmail}", password: "${password}"}) { customerAccessToken { accessToken, expiresAt }, customerUserErrors { code } } }`;
  const customerLoginMutation: GraphqlParams = { data: mutation }
  const { body: { data: { customerAccessTokenCreate: { customerAccessToken, customerUserErrors } } } } = await stfClient.query<{ data: { customerAccessTokenCreate: { customerAccessToken: any, customerUserErrors: any } } }>(customerLoginMutation)

  console.log(`Customer access token: %s`, customerAccessToken)
  console.log(customerId, queriedId, id)
  if (!!customerAccessToken && customerId === queriedId) {
    try {
      //delete customer using admin client
      const customerDeleteMutation = `mutation {
      customerDelete(input: {id: "${queriedId}"}){
        deletedCustomerId
        }
      }`
      const { data: { customerDelete: { deletedCustomerId } } } = await adminClient.query(customerDeleteMutation)
      console.log(`Deleted customer with id ${deletedCustomerId}`)
      dbClient.saveResource({ customerId: deletedCustomerId, status: "SUCCESS" })
      res.status(200)
    } catch (e) {
      dbClient.saveResource({ customerId: customerId, status: "FAILED" })
      res.status(500).send({ err: true })
    }
  } else if (customerId != queriedId) {
    console.log("Customer ID does not match")
    // dbClient.saveResource({ customerId: customerId, status: "FAILED" })
    res.status(400).send({ err: true })
  } else {
    console.log("Wrong password")
    res.status(405).send({ err: true })
  }
});

app.get('/deletedCustomers', authRoute, async function (req, res) {
  const data = await dbClient.getData()
  console.log(data)
  res.json(data)
})


app.get('/', function (req, res) { res.send('hello') })

var server = app.listen(port || 3000, function () {
  console.log('Shopify admin app listening on http://localhost:%s', port);
});
