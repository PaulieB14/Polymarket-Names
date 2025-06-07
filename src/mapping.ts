import { BigInt, Bytes, log, json, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";
import {
  QuestionInitialized as QuestionInitializedEvent
} from "../generated/UMACTFAdapterV2/UMACTFAdapter";
import {
  QuestionInitialized as BinaryQuestionInitializedEvent
} from "../generated/BinaryAdapter/BinaryAdapter";
import { Market, PriceRequest } from "../generated/schema";

export function handleQuestionInitialized(event: QuestionInitializedEvent): void {
  // Create a unique ID for the market
  let id = event.params.questionID.toHexString();
  
  // Create a new Market entity
  let market = new Market(id);
  
  // Set the properties from the event
  market.questionID = event.params.questionID;
  market.creator = event.params.creator;
  market.ancillaryData = event.params.ancillaryData;
  market.rewardToken = event.params.rewardToken;
  market.reward = event.params.reward;
  market.proposalBond = event.params.proposalBond;
  market.liveness = event.params.liveness;
  
  // Set metadata
  market.timestamp = event.block.timestamp;
  market.blockNumber = event.block.number;
  market.transactionHash = event.transaction.hash;
  
  // Extract the human-readable question from the ancillary data
  let ancillaryDataString = event.params.ancillaryData.toString();
  
  // Try to parse the ancillary data as JSON
  let questionText = "";
  
  if (ancillaryDataString.length > 0) {
    // Log the raw ancillary data for debugging
    log.info("Ancillary data: {}", [ancillaryDataString]);
    
    // Try to parse as JSON
    let jsonResult = json.try_fromString(ancillaryDataString);
    
    if (jsonResult.isOk) {
      let jsonValue = jsonResult.value;
      
      if (jsonValue.kind == JSONValueKind.OBJECT) {
        let jsonObject = jsonValue.toObject();
        let questionField = jsonObject.get("q");
        
        if (questionField && questionField.kind == JSONValueKind.STRING) {
          questionText = questionField.toString();
        }
      }
    }
    
    // If we couldn't parse as JSON or find the question field, use a fallback approach
    if (questionText == "") {
      // Look for patterns like "q":"What is the question?"
      let qPattern = ancillaryDataString.indexOf("q\":\"");
      
      if (qPattern >= 0) {
        let startIndex = qPattern + 4; // Length of 'q":"'
        let endIndex = ancillaryDataString.indexOf("\"", startIndex);
        
        if (endIndex > startIndex) {
          questionText = ancillaryDataString.substring(startIndex, endIndex);
        }
      }
    }
  }
  
  // Set the extracted question
  market.question = questionText;
  
  // Save the entity
  market.save();
}

export function handleBinaryQuestionInitialized(event: BinaryQuestionInitializedEvent): void {
  // Create a unique ID for the market
  let id = event.params.questionID.toHexString();
  
  // Create a new Market entity
  let market = new Market(id);
  
  // Set the properties from the event
  market.questionID = event.params.questionID;
  // Note: Binary adapter doesn't have creator as indexed
  market.creator = Bytes.fromHexString("0x0000000000000000000000000000000000000000"); // Default value
  market.ancillaryData = event.params.ancillaryData;
  market.rewardToken = event.params.rewardToken;
  market.reward = event.params.reward;
  market.proposalBond = event.params.proposalBond;
  // Note: Binary adapter has earlyResolutionEnabled instead of liveness
  market.liveness = BigInt.fromI32(0); // Default value
  
  // Set metadata
  market.timestamp = event.block.timestamp;
  market.blockNumber = event.block.number;
  market.transactionHash = event.transaction.hash;
  
  // Extract the human-readable question from the ancillary data
  let ancillaryDataString = event.params.ancillaryData.toString();
  
  // Try to parse the ancillary data as JSON
  let questionText = "";
  
  if (ancillaryDataString.length > 0) {
    // Log the raw ancillary data for debugging
    log.info("Binary Ancillary data: {}", [ancillaryDataString]);
    
    // Try to parse as JSON
    let jsonResult = json.try_fromString(ancillaryDataString);
    
    if (jsonResult.isOk) {
      let jsonValue = jsonResult.value;
      
      if (jsonValue.kind == JSONValueKind.OBJECT) {
        let jsonObject = jsonValue.toObject();
        let questionField = jsonObject.get("q");
        
        if (questionField && questionField.kind == JSONValueKind.STRING) {
          questionText = questionField.toString();
        }
      }
    }
    
    // If we couldn't parse as JSON or find the question field, use a fallback approach
    if (questionText == "") {
      // Look for patterns like "q":"What is the question?"
      let qPattern = ancillaryDataString.indexOf("q\":\"");
      
      if (qPattern >= 0) {
        let startIndex = qPattern + 4; // Length of 'q":"'
        let endIndex = ancillaryDataString.indexOf("\"", startIndex);
        
        if (endIndex > startIndex) {
          questionText = ancillaryDataString.substring(startIndex, endIndex);
        }
      }
    }
  }
  
  // Set the extracted question
  market.question = questionText;
  
  // Save the entity
  market.save();
}
