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



Once deployed, you can query the subgraph using GraphQL. Here's an example query to get a market by its ID:

📊 Core Query Categories:
1. 🎯 MARKET DISCOVERY & SEARCH
graphql

```{
  # Search by keywords
  cryptoMarkets: markets(where: { question_contains_nocase: "bitcoin" }) {
    questionID
    question
    creator
    reward
  }
  
  # Sports markets
  sportsMarkets: markets(where: { question_contains: "vs." }) {
    question
    timestamp
  }
  
  # Political markets
  politicalMarkets: markets(where: { question_contains_nocase: "trump" }) {
    question
    creator
  }
}
2. 💰 ECONOMIC ANALYSIS
graphql{
  # High-value markets (rewards > $5)
  premiumMarkets: markets(where: { reward_gte: "5000000" }) {
    question
    reward
    creator
  }
  
  # Free markets (no rewards)
  freeMarkets: markets(where: { reward: "0" }) {
    question
    creator
  }
  
  # Reward distribution analysis
  allRewards: markets(first: 1000, orderBy: reward, orderDirection: desc) {
    reward
    question
  }
}
3. 👥 CREATOR ANALYTICS
graphql{
  # Most active creator
  creatorActivity: markets(
    where: { creator: "0x91430cad2d3975766499717fa0d66a78d814e5c5" }
    first: 50
  ) {
    question
    reward
    timestamp
  }
  
  # Creator diversity
  allCreators: markets(first: 1000) {
    creator
    reward
    timestamp
  }
}
4. ⏰ TIME-BASED ANALYSIS
graphql{
  # Recent markets (last 24h)
  recentMarkets: markets(
    where: { timestamp_gte: "1749240000" }
    orderBy: timestamp
    orderDirection: desc
  ) {
    question
    timestamp
    creator
  }
  
  # Market creation timeline
  marketTimeline: markets(
    first: 100
    orderBy: timestamp
    orderDirection: desc
  ) {
    question
    timestamp
    creator
  }
}
5. 🔍 ADVANCED FILTERING
graphql{
  # Multi-criteria search
  filteredMarkets: markets(
    where: {
      question_contains: "Bitcoin"
      reward_gte: "1000000"
      timestamp_gte: "1748000000"
    }
    orderBy: reward
    orderDirection: desc
  ) {
    question
    reward
    timestamp
    creator
  }
}
🎮 Specialized Queries by Market Type:
Crypto Trading Markets:
graphql{
  # Bitcoin price predictions
  bitcoinMarkets: markets(where: { question_contains_nocase: "bitcoin up or down" }) {
    question
    timestamp
    creator
  }
  
  # Crypto threshold markets
  cryptoThresholds: markets(where: { question_contains: "Bitcoin Over" }) {
    question
    reward
  }
}
Sports & Gaming:
graphql{
  # Esports tournaments
  esportsMarkets: markets(where: { question_contains: "LEC" }) {
    question
    timestamp
  }
  
  # Tennis matches
  tennisMarkets: markets(where: { question_contains: "French Open" }) {
    question
    timestamp
  }
  
  # CS:GO tournaments
  csgoMarkets: markets(where: { question_contains: "BLAST" }) {
    question
    timestamp
  }
}
Political Markets:
graphql{
  # Trump-related markets
  trumpMarkets: markets(where: { question_contains_nocase: "trump" }) {
    question
    timestamp
    reward
  }
  
  # Election markets
  electionMarkets: markets(where: { question_contains: "Election" }) {
    question
    creator
  }
}
📈 Analytics & Statistics:
Market Volume Analysis:
graphql{
  # Count by creator
  markets(first: 1000) {
    creator
    reward
  }
  
  # Reward statistics
  markets(orderBy: reward, orderDirection: desc, first: 100) {
    reward
    question
  }
}
Trend Analysis:
graphql{
  # Markets by day/week
  markets(
    where: { timestamp_gte: "TIMESTAMP_HERE" }
    orderBy: timestamp
  ) {
    timestamp
    question
    creator
  }
}
🔧 Integration-Ready Queries:
For Dashboard Cards:
graphql{
  dashboardData: markets(
    first: 12
    orderBy: timestamp
    orderDirection: desc
    where: { reward_gte: "1000000" }
  ) {
    questionID  # For linking to other subgraphs
    question    # Human-readable title
    creator     # Market creator
    reward      # Market incentive
    timestamp   # Creation time
  }
}
For Search Functionality:
graphql{
  searchResults: markets(
    where: { question_contains_nocase: $searchTerm }
    first: 20
    orderBy: timestamp
    orderDirection: desc
  ) {
    questionID
    question
    timestamp
    creator
  }
}
```

🎯 What Information You Can Extract:
Market Intelligence:

Market Categories: Crypto, Sports, Politics, Entertainment
Market Creators: Who's creating the most markets
Reward Patterns: Which markets have higher incentives
Time Trends: When markets are created
Popular Topics: What subjects are trending

Business Analytics:

Creator Activity: Most active market creators
Market Economics: Reward distribution patterns
Growth Metrics: Market creation over time
Content Analysis: Popular keywords and topics

Integration Data:

questionID: Links to other Polymarket subgraphs
Human Names: Clean titles for UIs
Timestamps: For time-series analysis
Creator Info: For user tracking

🚀 Power User Queries:
You can even combine multiple filters for sophisticated analysis:
graphql
```{
  sophisticatedAnalysis: markets(
    where: {
      question_contains_nocase: "bitcoin"
      reward_gte: "5000000"  
      timestamp_gte: "1749000000"
      creator: "0x91430cad2d3975766499717fa0d66a78d814e5c5"
    }
    orderBy: reward
    orderDirection: desc
    first: 10
  ) {
    questionID
    question
    reward
    timestamp
    creator
  }
}
```
