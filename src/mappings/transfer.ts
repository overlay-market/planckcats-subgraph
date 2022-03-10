import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
	accounts,
	tokens,
	transactions
} from "../modules";

export namespace transfer {

	export function handleMinting(
    to: Bytes, 
    tokenId: string, 
    timestamp: BigInt, 
    blockId: string
  ): void {
		let account = accounts.getOrCreateAccount(to);
		account.save();

		let token = tokens.mintToken(tokenId, account.id);
		token.save();

		let transaction = transactions.getNewMint(account.id, tokenId, timestamp, blockId);
		transaction.save();
	}

  export function handleClaim(
    from: Bytes,
    to: Bytes,
    tokenId: string,
    timestamp: BigInt,
    blockId: string
  ): void {
    let minterContract = accounts.getOrCreateAccount(from);
    minterContract.save();

    let owner = accounts.getOrCreateAccount(to);
    owner.save();

    let token = tokens.changeOwner(tokenId, owner.id);
    token.save();

    let transaction = transactions.getNewClaim(minterContract.id, owner.id, tokenId, timestamp, blockId);
    transaction.save();
  }

	export function handleRegularTransfer(
    from: Bytes, 
    to: Bytes, 
    tokenId: string, 
    timestamp: BigInt, 
    blockId: string
  ): void {
		let seller = accounts.getOrCreateAccount(from);
		seller.save();

		let buyer = accounts.getOrCreateAccount(to);
		buyer.save();

		let token = tokens.changeOwner(tokenId, buyer.id);
		token.save();

		let transaction = transactions.getNewTransfer(seller.id, buyer.id, tokenId, timestamp, blockId);
		transaction.save();
	}
}