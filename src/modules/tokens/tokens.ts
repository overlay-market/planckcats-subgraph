import { BigInt, log } from "@graphprotocol/graph-ts";
import { Token, TokenCounter } from "../../../generated/schema";
import { integer, decimal, DEFAULT_DECIMALS, ZERO_ADDRESS } from '@protofire/subgraph-toolkit'
export namespace tokens {

  export function getOrCreateToken(
    tokenId: string, 
    accountId: string
  ): Token {
		let token = Token.load(tokenId);

		if (token == null) {
			token = new Token(tokenId);
			token.owner = accountId;
		}

		return token as Token;
	}

  export function tokenCount(
    tokenId: string
  ): TokenCounter {
    let tokenCounter = TokenCounter.load(ZERO_ADDRESS);

    if (tokenCounter == null) {
      tokenCounter = new TokenCounter(ZERO_ADDRESS);
      tokenCounter.totalSupply = integer.ZERO;
    }

    tokenCounter.totalSupply = BigInt.fromString(tokenId);
    return tokenCounter as TokenCounter;
  }

  export function loadToken(
    tokenId: string
  ): Token {
		let token = Token.load(tokenId);

		if (token == null) {
			// maybe it should be created or loaded
			log.info(
				"@@@@@ at func: {} msg: {}",
				["loadToken",
					"Couldn't find token w/ id: " + tokenId]
			);
			log.critical("", [""]);
		}

		return token as Token;
	}

  export function mintToken(
		tokenId: string, 
    owner: string
	): Token {
		let token = getOrCreateToken(tokenId, owner);
		return token as Token;
	}

  export function changeOwner(
    tokenId: string, 
    owner: string
  ): Token {
		let token = getOrCreateToken(tokenId, owner);
		token.owner = owner;
		return token as Token;
	}

  export function setApproval(
    tokenId: string, 
    approval: string, 
    owner: string
  ): Token {
		let token = getOrCreateToken(tokenId, owner);
		token.approval = approval;
		return token as Token;
	}

}