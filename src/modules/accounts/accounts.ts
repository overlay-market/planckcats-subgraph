import { Bytes } from '@graphprotocol/graph-ts';
import { Account } from '../../../generated/schema';

export namespace accounts {

	export function getOrCreateAccount(accountAddress: Bytes): Account {
		let accountId = accountAddress.toHex();
		let account = Account.load(accountId);

		if (account == null) {
			account = new Account(accountId);
			account.address = accountAddress;
		}

		return account as Account;
	}

}