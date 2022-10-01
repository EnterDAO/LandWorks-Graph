# LandWorks-Graph
Repository containing the Subgraph of LandWorks protocol

## Running Local Graph Node

Open the `docker-compose.yml` file and edit the `ethereum` node url you want to use.

## Development

There are `npm scripts` for all the stages of subgraph development.

1. Building the subgraph (code generation + creating the subgraph): `npm run build --config=dev.json`
2. Deploying to the Local Graph Node: `npm run deploy:local --config={config.json}`
3. Deploying to the Rinkeby Graph Node: `npm run deploy:rinkeby --config={config.json}`
4. Deploying to the Mainnet Graph Node: `npm run deploy:mainnet --config={config.json}`
5. Deploying to the Rinkeby Hosted Service: `npm run deploy:rinkeby-hosted --config={config.json}`
6. Deploying to the Mainnet Hosted Service `npm run deploy:mainnet-hosted --config={config.json}`
   Where `{config.json}` is the file name of the config you want to deploy. For example, if you want to deploy locally the mainnet config, execute: `npm run deploy:local --config=mainnet.json`

## Supported APIs

- [X] Overview Info
- [X] Get All Metaverses
- [X] Get All Metaverses' Registries
- [X] Get All Payment Tokens
- [X] Get All Assets
- [X] Get All Rents
- [X] Get Users' assets
- [X] Get Users' rents
- [X] Get Users' consumers
- [X] Get Users' claim history
- [X] Get Users' referral rewards
