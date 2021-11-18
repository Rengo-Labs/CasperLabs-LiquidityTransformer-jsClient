import {
	CasperClient,
	CLPublicKey,
	CLAccountHash,
	CLByteArray,
	CLKey,
	CLString,
	CLTypeBuilder,
	CLValue,
	CLValueBuilder,
	CLValueParsers,
	CLMap,
	DeployUtil,
	EventName,
	EventStream,
	Keys,
	RuntimeArgs,
	CLURef,
	decodeBase16,
	AccessRights,
	CLU256,
} from "casper-js-sdk";
import { LIQUIDITYEvents } from "./constants";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
import { concat } from "@ethersproject/bytes";
import blake from "blakejs";

// const axios = require("axios").default;

class LIQUIDITYClient {
	private contractHash: string;
	private contractPackageHash: string;

	private isListening = false;
	private pendingDeploys: IPendingDeploy[] = [];

	constructor(
		private nodeAddress: string,
		private chainName: string,
		private eventStreamAddress?: string
	) {}

	public async install(
		keys: Keys.AsymmetricKey,
		usingProvable: string,
		wiseToken: string,
		uniswapPair: string,
		contractName: string,
		paymentAmount: string,
		wasmPath: string
	) {
		const usingProvableContractHash = new CLByteArray(
			Uint8Array.from(Buffer.from(usingProvable, "hex"))
		);
		const wiseTokenContractHash = new CLByteArray(
			Uint8Array.from(Buffer.from(wiseToken, "hex"))
		);
		const uniswapPairContractHash = new CLByteArray(
			Uint8Array.from(Buffer.from(uniswapPair, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			using_provable: CLValueBuilder.key(usingProvableContractHash),
			wise_token: CLValueBuilder.key(wiseTokenContractHash),
			uniswap_pair: CLValueBuilder.key(uniswapPairContractHash),
			contract_name: CLValueBuilder.string(contractName),
		});

		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: wasmPath,
			runtimeArgs,
		});

		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Problem with installation");
		}
	}

	public async _reserve_Wise(
		keys: Keys.AsymmetricKey,
		investmentDays: string,
		referralAddress: string,
		amount: string,
		paymentAmount: string
	) {
		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			//ISSUE
			investment_days: CLValueBuilder.u256(investmentDays),
			referral_address: CLValueBuilder.key(referralAdd),
			amount: CLValueBuilder.u256(amount),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "_reserve_wise",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async reserveWiseWithToken(
		keys: Keys.AsymmetricKey,
		tokenAddress: string,
		tokenAmount: string,
		investmentDays: string,
		referralAddress: string,
		paymentAmount: string
	) {
		const tokenContractHash = new CLByteArray(
			Uint8Array.from(Buffer.from(tokenAddress, "hex"))
		);

		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			token_address: CLValueBuilder.key(tokenContractHash),
			token_amount: CLValueBuilder.u256(tokenAmount),
			//ISSUE
			investment_days: CLValueBuilder.u256(investmentDays),
			referral_address: CLValueBuilder.key(referralAdd),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "reserve_wise_with_token",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async reserveWise(
		keys: Keys.AsymmetricKey,
		investmentDays: string,
		referralAddress: string,
		senderAddress: string,
		senderValue: string,
		paymentAmount: string
	) {
		const senderAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(senderAddress, "hex"))
		);

		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			//ISSUE
			investment_days: CLValueBuilder.u256(investmentDays),
			referral_address: CLValueBuilder.key(referralAdd),
			sender_address: CLValueBuilder.key(senderAdd),
			sender_value: CLValueBuilder.u256(senderValue),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "reserve_wise",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async addBalance(
		keys: Keys.AsymmetricKey,
		senderAddress: string,
		investmentDay: string,
		investmentBalance: string,
		paymentAmount: string
	) {
		const senderAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(senderAddress, "hex"))
		);

		const runtimeArgs = RuntimeArgs.fromMap({
			sender_address: CLValueBuilder.key(senderAdd),
			investment_day: CLValueBuilder.u256(investmentDay),
			investment_balance: CLValueBuilder.u256(investmentBalance),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "add_balance",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async generateSupply(
		keys: Keys.AsymmetricKey,
		investmentDay: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u64(investmentDay),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "generate_supply",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async generateStaticSupply(
		keys: Keys.AsymmetricKey,
		investmentDay: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDay),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "generate_static_supply",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async generateRandomSupply(
		keys: Keys.AsymmetricKey,
		investmentDay: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDay),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "generate_random_supply",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async callBack(
		keys: Keys.AsymmetricKey,
		queryId: string,
		results: string,
		proofs: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			query_id: CLValueBuilder.string(queryId),
			result: CLValueBuilder.string(results),
			proof: CLValueBuilder.string(proofs),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "call_back",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async timeOut(keys: Keys.AsymmetricKey, paymentAmount: string) {
		const runtimeArgs = RuntimeArgs.fromMap({});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "timeout",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async prepareReferralBonuses(
		keys: Keys.AsymmetricKey,
		referralBatchFrom: string,
		referralBatchTo: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			referral_batch_from: CLValueBuilder.u256(referralBatchFrom),
			referral_batch_to: CLValueBuilder.u256(referralBatchTo),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "prepare_referral_bonuses",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async fullReferralBonus(
		keys: Keys.AsymmetricKey,
		referralAddress: string,
		referralAmount: string,
		ratio: string,
		paymentAmount: string
	) {
		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			referral_address: CLValueBuilder.key(referralAdd),
			referral_amount: CLValueBuilder.u256(referralAmount),
			ratio: CLValueBuilder.u256(ratio),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "full_referral_bonus",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async familyReferralBonus(
		keys: Keys.AsymmetricKey,
		referralAddress: string,
		ratio: string,
		paymentAmount: string
	) {
		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			referral_address: CLValueBuilder.key(referralAdd),
			ratio: CLValueBuilder.u256(ratio),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "family_referral_bonus",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async forwardLiquidity(
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "forward_liquidity",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async getMyTokens(keys: Keys.AsymmetricKey, paymentAmount: string) {
		const runtimeArgs = RuntimeArgs.fromMap({});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "get_my_tokens",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async payoutInvestmentDayBatch(
		keys: Keys.AsymmetricKey,
		investmentDay: string,
		investorBatchFrom: string,
		investorBatchTo: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDay),
			investor_batch_from: CLValueBuilder.u256(investorBatchFrom),
			investor_batch_to: CLValueBuilder.u256(investorBatchTo),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "payout_investment_day_batch",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async payoutReferralBatch(
		keys: Keys.AsymmetricKey,
		referralBatchFrom: string,
		referralBatchTo: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			referral_batch_from: CLValueBuilder.u256(referralBatchFrom),
			referral_batch_to: CLValueBuilder.u256(referralBatchTo),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "payout_referral_batch",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async checkInvestmentDays(
		keys: Keys.AsymmetricKey,
		investmentDays: string,
		currentWiseDay: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			// ISSUE
			investment_days: CLValueBuilder.u256(investmentDays),
			current_wise_day: CLValueBuilder.u64(currentWiseDay),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "check_investment_days",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async requestTeamFunds(
		keys: Keys.AsymmetricKey,
		Amount: string,
		teamAddressPurse: string,
		paymentAmount: string
	) {
		const team_address_purse = new CLURef(
			decodeBase16(teamAddressPurse),
			AccessRights.READ_ADD_WRITE
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			amount: CLValueBuilder.u256(Amount),
			//ISSUE

			team_address_purse,
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "request_team_funds",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	/*=========================Getters=========================*/

	public async payoutInvestorAddress(investorAddress: CLPublicKey) {
		const investor_address = Buffer.from(
			investorAddress.toAccountHash()
		).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			investor_address,
			"payout_investor_address"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async payoutReferralAddress(referralAddress: CLPublicKey) {
		const referral_address = Buffer.from(
			referralAddress.toAccountHash()
		).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			referral_address,
			"payout_referral_address"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async myInvestmentAmount(investment_day: CLU256) {
		//Cannot pass u256 in the argument
		//Throws Error that you cannot pass CLU256 in string

		// const investment_day = CLValueBuilder.u256(investmentDay);
		const finalBytes = concat([
			CLValueParsers.toBytes(investment_day).unwrap(),
		]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);
		const encodedBytes = Buffer.from(blaked).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"my_investment_amount"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async myInvestmentAmountAllDays() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"my_investment_amount_all_days"
		);
		return result.value().toString();
	}

	public async myTotalInvestmentAmount() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"my_total_investment_amount"
		);
		return result.value().toString();
	}

	public async investorsOnDay(investment_day: CLU256) {
		//Cannot pass u256 in the argument
		//Throws Error that you cannot pass CLU256 in string
		// const investment_day = CLValueBuilder.u256(investmentDay);
		const finalBytes = concat([
			CLValueParsers.toBytes(investment_day).unwrap(),
		]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);
		const encodedBytes = Buffer.from(blaked).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"investors_on_day"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async investorsOnAllDays() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"investors_on_all_days"
		);
		return result.value().toString();
	}

	public async investmentsOnAllDays() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"investments_on_all_days"
		);
		return result.value().toString();
	}

	public async supplyOnAllDays() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"supply_on_all_days"
		);
		return result.value().toString();
	}

	public async preparePath(tokenAddress: CLPublicKey) {
		const token_address = Buffer.from(tokenAddress.toAccountHash()).toString(
			"hex"
		);

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			token_address,
			"prepare_path"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async teamContribution(team_amount: CLU256) {
		//Cannot pass u256 in the argument
		//Throws Error that you cannot pass CLU256 in string

		// const team_amount = CLValueBuilder.u256(teamAmount);

		const finalBytes = concat([CLValueParsers.toBytes(team_amount).unwrap()]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);
		const encodedBytes = Buffer.from(blaked).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"team_contribution"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async fundedDays() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"funded_days"
		);
		return result.value().toString();
	}

	public async calculateDailyRatio(investment_day: CLU256) {
		//Cannot pass u256 in the argument
		//Throws Error that you cannot pass CLU256 in string

		// const investment_day = CLValueBuilder.u256(investmentDay);

		const finalBytes = concat([
			CLValueParsers.toBytes(investment_day).unwrap(),
		]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);
		const encodedBytes = Buffer.from(blaked).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"calculate_daily_ratio"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async currentWiseDay() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"current_wise_day"
		);
		return result.value().toString();
	}

	//Same issue as allowence
	public async requestRefund(
		investorParam: CLPublicKey,
		succesor_purse: CLURef
	) {
		const investor = new CLKey(
			new CLAccountHash(investorParam.toAccountHash())
		);
		const finalBytes = concat([
			CLValueParsers.toBytes(investor).unwrap(),
			CLValueParsers.toBytes(succesor_purse).unwrap(),
		]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);
		const encodedBytes = Buffer.from(blaked).toString("hex");

		// const succesor_purse = new CLURef(
		// 	decodeBase16(succesorPurse),
		// 	AccessRights.READ_ADD_WRITE
		// );

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"request_refund"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}
	// public async feeTo() {
	// 	const result = await contractSimpleGetter(
	// 		this.nodeAddress,
	// 		this.contractHash,
	// 		["fee_to"]
	// 	);
	// 	return result.value().toString();
	// }

	// public async getPair(tokenA: String, tokenB: String) {
	// 	const tokenAContractHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(tokenA, "hex"))
	// 	);
	// 	const tokenBContractHash = new CLByteArray(
	// 		Uint8Array.from(Buffer.from(tokenB, "hex"))
	// 	);

	// 	const ContractHash: string = `${tokenAContractHash}_${tokenBContractHash}`;

	// 	const result = await utils.contractDictionaryGetter(
	// 		this.nodeAddress,
	// 		ContractHash,
	// 		"get_pair"
	// 	);
	// 	const maybeValue = result.value().unwrap();
	// 	return maybeValue.value().toString();
	// }

	// public async setFeeTo(
	// 	keys: Keys.AsymmetricKey,
	// 	feeTo: RecipientType,
	// 	paymentAmount: string
	// ) {
	// 	const runtimeArgs = RuntimeArgs.fromMap({
	// 		fee_to: utils.createRecipientAddress(feeTo),
	// 	});

	// 	const deployHash = await contractCall({
	// 		chainName: this.chainName,
	// 		contractHash: this.contractHash,
	// 		entryPoint: "set_fee_to",
	// 		paymentAmount,
	// 		nodeAddress: this.nodeAddress,
	// 		keys: keys,
	// 		runtimeArgs,
	// 	});

	// 	if (deployHash !== null) {
	// 		this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
	// 		return deployHash;
	// 	} else {
	// 		throw Error("Invalid Deploy");
	// 	}
	// }
}

interface IInstallParams {
	nodeAddress: string;
	keys: Keys.AsymmetricKey;
	chainName: string;
	pathToContract: string;
	runtimeArgs: RuntimeArgs;
	paymentAmount: string;
}

const installWasmFile = async ({
	nodeAddress,
	keys,
	chainName,
	pathToContract,
	runtimeArgs,
	paymentAmount,
}: IInstallParams): Promise<string> => {
	const client = new CasperClient(nodeAddress);

	// Set contract installation deploy (unsigned).
	let deploy = DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(
			CLPublicKey.fromHex(keys.publicKey.toHex()),
			chainName
		),
		DeployUtil.ExecutableDeployItem.newModuleBytes(
			utils.getBinary(pathToContract),
			runtimeArgs
		),
		DeployUtil.standardPayment(paymentAmount)
	);

	// Sign deploy.
	deploy = client.signDeploy(deploy, keys);

	// Dispatch deploy to node.
	return await client.putDeploy(deploy);
};

interface IContractCallParams {
	nodeAddress: string;
	keys: Keys.AsymmetricKey;
	chainName: string;
	entryPoint: string;
	runtimeArgs: RuntimeArgs;
	paymentAmount: string;
	contractHash: string;
}

const contractCall = async ({
	nodeAddress,
	keys,
	chainName,
	contractHash,
	entryPoint,
	runtimeArgs,
	paymentAmount,
}: IContractCallParams) => {
	const client = new CasperClient(nodeAddress);
	const contractHashAsByteArray = utils.contractHashToByteArray(contractHash);

	let deploy = DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(keys.publicKey, chainName),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(
			contractHashAsByteArray,
			entryPoint,
			runtimeArgs
		),
		DeployUtil.standardPayment(paymentAmount)
	);

	// Sign deploy.
	deploy = client.signDeploy(deploy, keys);

	// Dispatch deploy to node.
	const deployHash = await client.putDeploy(deploy);

	return deployHash;
};

const contractSimpleGetter = async (
	nodeAddress: string,
	contractHash: string,
	key: string[]
) => {
	const stateRootHash = await utils.getStateRootHash(nodeAddress);
	const clValue = await utils.getContractData(
		nodeAddress,
		stateRootHash,
		contractHash,
		key
	);

	if (clValue && clValue.CLValue instanceof CLValue) {
		return clValue.CLValue!;
	} else {
		throw Error("Invalid stored value");
	}
};

export default LIQUIDITYClient;
