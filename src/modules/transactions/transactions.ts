import { ZERO_ADDRESS } from "@protofire/subgraph-toolkit";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  Mint,
  Claim,
  Transfer
} from "../../../generated/schema";

export namespace transactions {

  export namespace constants {
    export let TRANSACTION_MINT = "MINT";
    export let TRANSACTION_CLAIM = "CLAIM";
    export let TRANSACTION_TRANSFER = "TRANSFER";
  }

  export namespace helpers {
    export function getNewTransactionId(
      from: string, 
      to: string, 
      timestamp: BigInt
    ): string {
      return from + "-" + to + "-" + timestamp.toString();
    }
  }

	export function getNewMint(
		to: string, 
    token: string, 
    timestamp: BigInt, 
    blockId: string
	): Mint {
		let transaction = new Mint(helpers.getNewTransactionId(ZERO_ADDRESS, to, timestamp))

		transaction.from = ZERO_ADDRESS;
		transaction.to = to;
		transaction.token = token;
		transaction.block = blockId;
		transaction.type = constants.TRANSACTION_MINT;

		return transaction as Mint;
	}

  export function getNewClaim(
    from: string,
    to: string,
    token: string,
    timestamp: BigInt,
    blockId: string
  ): Claim {
    let transaction = new Claim(helpers.getNewTransactionId(from, to, timestamp));

    transaction.from = from;
		transaction.to = to;
		transaction.token = token;
		transaction.block = blockId;
		transaction.type = constants.TRANSACTION_CLAIM;

    return transaction as Claim;
  }

  export function getNewTransfer(
    from: string,
    to: string,
    token: string,
    timestamp: BigInt,
    blockId: string
  ): Transfer {
    let transaction = new Transfer(helpers.getNewTransactionId(from, to, timestamp));

    transaction.from = from;
		transaction.to = to;
		transaction.token = token;
		transaction.block = blockId;
		transaction.type = constants.TRANSACTION_TRANSFER;

    return transaction as Transfer;
  }
}