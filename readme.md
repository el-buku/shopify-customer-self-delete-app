this app was created in order to allow customers to self delete their own account because shopify doesn't allow that out-of-the-box ._.

steps:
- over ngrok tunnel or ssl connection
- rename `.env.example` -> `.env` and make it your own
- run `yarn` or `npm install`
- add the snippet in ./liquid on your theme
- config app proxy instance
- run `yarn start` or `npm run start`
