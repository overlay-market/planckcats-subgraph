import { ZERO_ADDRESS } from "./constants";

import {
  Mint,
  Claim,
} from "../../generated/PlanckCatsMinter/PlanckCatsMinter";

import { 
  blocks
} from "../modules";

export function handleMint(event: Mint): void {
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice,
	)
	meta.save()

	let to = event.params._to.toHex()
	let tokenId = event.params._tokenId.toHex()

	token.save()
}