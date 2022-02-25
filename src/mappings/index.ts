
import { ZERO_ADDRESS } from "@protofire/subgraph-toolkit";
import { MINTER_CONTRACT_ADDRESS } from "./constants";
import {
  Mint,
  Claim,
} from "../../generated/PlanckCatsMinter/PlanckCatsMinter";

import { 
  Approval,
  Transfer
} from "../../generated/PlanckCatsToken/PlanckCatsToken";

import { transfer } from "./transfer";

import { 
  accounts,
  tokens,
  blocks,
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
	} else if (from == MINTER_CONTRACT_ADDRESS) {
    transfer.handleClaim(event.params.from, event.params.to, tokenId, timestamp, blockId);
  } else {
		transfer.handleRegularTransfer(event.params.from, event.params.to, tokenId, timestamp, blockId)
	}
}

export function handleApproval(event: Approval): void {
	let tokenId = event.params.tokenId.toHex();
	let ownerAddress = event.params.owner;
	let approvedAddress = event.params.approved;
	let blockNumber = event.block.number;
	let blockId = blockNumber.toString();
	let txHash = event.transaction.hash;
	let timestamp = event.block.timestamp;

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	);
	meta.save();

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber);
	block.save();

	let approved = accounts.getOrCreateAccount(approvedAddress);
	approved.save();

	let owner = accounts.getOrCreateAccount(ownerAddress);
	owner.save();

	let token = tokens.setApproval(tokenId, approvedAddress.toHex(), owner.id);
	token.save();
}
