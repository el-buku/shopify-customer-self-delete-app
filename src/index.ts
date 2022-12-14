import '@shopify/shopify-api/adapters/node';

import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import config from './config';

const { port } = config;

import { AppAuth, Core, Admin } from './controllers'
import { authRoute, installRequired } from "./middleware";

const app = express();

app.use(bodyParser.json());

app.all("/*", cors({ credentials: true }))

app.get('/install', AppAuth.install)

app.get('/install/callback', AppAuth.callback)

app.post('/delete', installRequired, Core.deleteCustomer);

app.get('/history', authRoute, Core.getRecords)

app.get('/', installRequired, Admin.appIndex)

app.listen(port || 3000, function () {
  console.log('Shopify admin app listening on http://localhost:%s', port);
})
