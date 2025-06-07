import { QuestionInitialized as QuestionInitializedEvent } from "../generated/UMACTFAdapterV2/UMACTFAdapter"
import { QuestionInitialized as BinaryQuestionInitializedEvent } from "../generated/BinaryAdapter/BinaryAdapter"

import {
  Market,
  QuestionInitialized,
  QuestionResolved,
  AncillaryDataUpdated,
  QuestionEmergencyResolved,
  QuestionFlagged,
  QuestionPaused,
  QuestionReset,
  QuestionUnpaused,
  NewAdmin,
  RemovedAdmin
} from "../generated/schema"

import { BigInt, Bytes, log, json, JSONValueKind } from "@graphprotocol/graph-ts"

// Helper function to decode ancillary data and extract human-readable question
function extractQuestionFromAncillaryData(ancillaryData: Bytes): string | null {
  if (ancillaryData.length === 0) {
    return null
  }

  // Convert bytes to string
  let ancillaryDataString = ancillaryData.toString()
  log.info("Raw ancillary data: {}", [ancillaryDataString])
  
  // Try to parse as JSON
  let jsonResult = json.try_fromString(ancillaryDataString)
  if (jsonResult.isOk) {
    let jsonValue = jsonResult.value
    if (jsonValue.kind == JSONValueKind.OBJECT) {
      let obj = jsonValue.toObject()
      
      // Look for question field (usually "q")
      let questionValue = obj.get("q")
      if (questionValue && questionValue.kind == JSONValueKind.STRING) {
        let question = questionValue.toString()
        log.info("Extracted question: {}", [question])
        return question
      }
      
      // Fallback: look for "question" field
      let questionFieldValue = obj.get("question")
      if (questionFieldValue && questionFieldValue.kind == JSONValueKind.STRING) {
        return questionFieldValue.toString()
      }
    }
  }
  
  // If JSON parsing fails, try a regex-based approach
  let qPattern = ancillaryDataString.indexOf("q\":\"")
  if (qPattern >= 0) {
    let startIndex = qPattern + 4 // Length of 'q":"'
    let endIndex = ancillaryDataString.indexOf("\"", startIndex)
    
    if (endIndex > startIndex) {
      let question = ancillaryDataString.substring(startIndex, endIndex)
      log.info("Extracted question using regex: {}", [question])
      return question
    }
  }
  
  // If all else fails, return the raw string (might be plain text)
  return ancillaryDataString
}

export function handleQuestionInitialized(event: QuestionInitializedEvent): void {
  // Create a unique ID for the market
  let id = event.params.questionID.toHexString()
  
  // Create a new Market entity
  let market = new Market(id)
  
  // Set the properties from the event
  market.questionID = event.params.questionID
  market.creator = event.params.creator
  market.ancillaryData = event.params.ancillaryData
  market.rewardToken = event.params.rewardToken
  market.reward = event.params.reward
  market.proposalBond = event.params.proposalBond
  market.liveness = event.params.liveness
  
  // Set metadata
  market.timestamp = event.block.timestamp
  market.blockNumber = event.block.number
  market.transactionHash = event.transaction.hash
  
  // Extract the human-readable question from the ancillary data
  let question = extractQuestionFromAncillaryData(event.params.ancillaryData)
  if (question) {
    log.info("Market question: {}", [question])
    market.question = question
  }
  
  // Save the entity
  market.save()
  
  // Also create a QuestionInitialized entity for the event
  let entity = new QuestionInitialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  entity.questionID = event.params.questionID
  entity.creator = event.params.creator
  entity.ancillaryData = event.params.ancillaryData
  entity.rewardToken = event.params.rewardToken
  entity.reward = event.params.reward
  entity.proposalBond = event.params.proposalBond
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  if (question) {
    entity.question = question
  }
  
  entity.save()
}

export function handleBinaryQuestionInitialized(event: BinaryQuestionInitializedEvent): void {
  // Create a unique ID for the market
  let id = event.params.questionID.toHexString()
  
  // Create a new Market entity
  let market = new Market(id)
  
  // Set the properties from the event
  market.questionID = event.params.questionID
  // Note: Binary adapter doesn't have creator as indexed
  market.creator = Bytes.fromHexString("0x0000000000000000000000000000000000000000") // Default value
  market.ancillaryData = event.params.ancillaryData
  market.rewardToken = event.params.rewardToken
  market.reward = event.params.reward
  market.proposalBond = event.params.proposalBond
  // Note: Binary adapter has earlyResolutionEnabled instead of liveness
  market.liveness = BigInt.fromI32(0) // Default value
  
  // Set metadata
  market.timestamp = event.block.timestamp
  market.blockNumber = event.block.number
  market.transactionHash = event.transaction.hash
  
  // Extract the human-readable question from the ancillary data
  let question = extractQuestionFromAncillaryData(event.params.ancillaryData)
  if (question) {
    log.info("Binary market question: {}", [question])
    market.question = question
  }
  
  // Save the entity
  market.save()
  
  // Also create a QuestionInitialized entity for the event
  let entity = new QuestionInitialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  entity.questionID = event.params.questionID
  entity.creator = Bytes.fromHexString("0x0000000000000000000000000000000000000000") // Default value
  entity.ancillaryData = event.params.ancillaryData
  entity.rewardToken = event.params.rewardToken
  entity.reward = event.params.reward
  entity.proposalBond = event.params.proposalBond
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  if (question) {
    entity.question = question
  }
  
  entity.save()
}
