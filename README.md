# Polymarket Human-Readable Markets Subgraph

This subgraph indexes Polymarket market data from UMA CTF Adapter contracts to extract human-readable market names. It provides a mapping between market IDs and their human-readable questions, eliminating the need to rely on Polymarket's API for this information.

## Overview

The subgraph indexes the following contracts:

1. **Current UMA CTF Adapter V2** - `0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74`
2. **Legacy UMA CTF Adapter** - `0x71392E133063CC0D16F40E1F9B60227404Bc03f7`
3. **Binary Adapter** - `0xCB1822859cEF82Cd2Eb4E6276C7916e692995130`

It captures the `QuestionInitialized` events from these contracts and extracts the human-readable question from the ancillary data.

## Schema

The subgraph defines the following entities:


```graphql
type Market @entity {
  id: ID!
  questionID: Bytes!
  creator: Bytes
  question: String
  ancillaryData: Bytes
  rewardToken: Bytes
  reward: BigInt
  proposalBond: BigInt
  liveness: BigInt
  timestamp: BigInt
  blockNumber: BigInt
  transactionHash: Bytes
}

type PriceRequest @entity {
  id: ID!
  requester: Bytes!
  identifier: Bytes!
  timestamp: BigInt!
  ancillaryData: Bytes
  currency: Bytes
  reward: BigInt
  blockNumber: BigInt
  transactionHash: Bytes
}

type QuestionInitialized @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  requestTimestamp: BigInt # uint256
  creator: Bytes! # address
  ancillaryData: Bytes! # bytes
  question: String # human-readable question
  rewardToken: Bytes! # address
  reward: BigInt! # uint256
  proposalBond: BigInt! # uint256
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type QuestionResolved @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  settledPrice: BigInt! # int256
  payouts: [BigInt!]! # uint256[]
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type AncillaryDataUpdated @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  owner: Bytes! # address
  update: Bytes! # bytes
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type QuestionEmergencyResolved @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  payouts: [BigInt!]! # uint256[]
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type QuestionFlagged @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type QuestionPaused @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type QuestionReset @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type QuestionUnpaused @entity(immutable: true) {
  id: Bytes!
  questionID: Bytes! # bytes32
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type NewAdmin @entity(immutable: true) {
  id: Bytes!
  admin: Bytes! # address
  newAdminAddress: Bytes! # address
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type RemovedAdmin @entity(immutable: true) {
  id: Bytes!
  admin: Bytes! # address
  removedAdmin: Bytes! # address
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

## How It Works

1. The subgraph listens for `QuestionInitialized` events from the UMA CTF Adapter contracts.
2. When an event is detected, it extracts the ancillary data, which contains the human-readable question.
3. It attempts to parse the ancillary data as JSON and extract the question field.
4. If parsing as JSON fails, it falls back to a regex-based approach to extract the question.
5. The extracted question is stored in the `Market` entity, which can be queried using the market ID.

## Deployment

### Prerequisites

- Node.js (v20.18.1 or later recommended)
- Graph CLI installed globally: `npm install -g @graphprotocol/graph-cli`

### Deploying to The Graph Studio

1. Authenticate with The Graph:

```bash
graph auth <your-deploy-key>
```

2. Deploy the subgraph:

```bash
cd polymarket-subgraph
npm run deploy
```

### Deploying Locally

1. Start a local Graph Node:

```bash
# Using Docker
docker-compose up -d
```

2. Create and deploy the subgraph locally:

```bash
cd polymarket-subgraph
npm run create-local
npm run deploy-local
```

## Usage

Once deployed, you can query the subgraph using GraphQL. Here's an example query to get a market by its ID:

```graphql
{
  market(id: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef") {
    id
    questionID
    question
    creator
    timestamp
  }
}
```

Or to get all markets:

```graphql
{
  markets(first: 100) {
    id
    questionID
    question
    creator
    timestamp
  }
}
```

## Development

### Building

```bash
cd polymarket-subgraph
npm run codegen
npm run build
```

### Testing

You can test the subgraph by deploying it to a local Graph Node and querying it.

## License

ISC
