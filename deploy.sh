#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

mustache config/$CONFIG subgraph.template.yaml > subgraph.yaml

# Run codegen and build
graph codegen
graph build

if [[ "$NO_DEPLOY" = true ]]; then
  rm subgraph.yaml
  exit 0
fi

# Select IPFS and The Graph nodes
if [ "$GRAPH" == "local" ]
then
  IPFS_NODE="http://localhost:5001"
  GRAPH_NODE="http://127.0.0.1:8020"
elif [ "$GRAPH" == "goerli" ]
then
  IPFS_NODE=""
  GRAPH_NODE=""
elif [ "$GRAPH" == "rinkeby" ]
then
  IPFS_NODE=""
  GRAPH_NODE=""
elif [ "$GRAPH" = "mainnet" ]
then
  IPFS_NODE=""
  GRAPH_NODE=""
elif [ "$GRAPH" = "mainnet-remote" ]
then
  graph deploy --studio enterdao/LandWorks-Graph
  # Remove manifest
  rm subgraph.yaml
  exit 0
elif [ "$GRAPH" = "rinkeby-hosted" ]
then
  graph deploy --product hosted-service enterdao/landworks-rinkeby
  # Remove manifest
  rm subgraph.yaml
  exit 0
elif [ "$GRAPH" = "mainnet-hosted" ]
then
  graph deploy --product hosted-service enterdao/landworks
  # Remove manifest
  rm subgraph.yaml
  exit 0
elif [ "$GRAPH" = "goerli-hosted" ]
then
  graph deploy --product hosted-service enterdao/landworks-goerli
  # Remove manifest
  rm subgraph.yaml
  exit 0
fi

# Create subgraph if missing
{
  graph create enterdao/LandWorks-Graph --node ${GRAPH_NODE}
} || {
  echo 'Subgraph was already created'
}

# Deploy subgraph
graph deploy enterdao/LandWorks-Graph --ipfs ${IPFS_NODE} --node ${GRAPH_NODE}

# Remove manifest
rm subgraph.yaml
