
import { ZERO_ADDRESS } from "@protofire/subgraph-toolkit";

import {
  Mint,
  Claim,
} from "../../generated/PlanckCatsMinter/PlanckCatsMinter";

import { 
  Transfer
} from "../../generated/PlanckCatsToken/PlanckCatsToken";

import { 
  tokens,
  blocks,
  transactions,
  transactionsMeta
} from "../modules";

export function handleMint(event: Mint): void {
	let blockNumber = event.block.number;
	let blockId = blockNumber.toString();
	let txHash = event.transaction.hash;
	let timestamp = event.block.timestamp;

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber);
	block.save();

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	);
	meta.save();

	let to = event.params.to.toHex();
	let tokenId = event.params.id.toHex();

  let tokenCounter = tokens.tokenCount(tokenId);
	tokenCounter.save();
}

export function handleTransfer(event: Transfer): void {
	let from = event.params.from.toHex();
	let to = event.params.to.toHex();
	let tokenId = event.params.tokenId.toHex();
	let blockNumber = event.block.number;
	let blockId = blockNumber.toString();
	let txHash = event.transaction.hash;
	let timestamp = event.block.timestamp;

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber);
	block.save();

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	);
	meta.save();

	if (from == ZERO_ADDRESS) {
		transfer.handleMint(event.params.to, tokenId, timestamp, blockId)
	} else if (to == ZERO_ADDRESS) {
		transfer.handleBurn(event.params.from, tokenId, timestamp, blockId)
	} else {
		transfer.handleRegularTransfer(event.params.from, event.params.to, tokenId, timestamp, blockId)
	}

}

