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
} from "casper-js-sdk";
// import { FACTORYEvents } from "./constants";
import * as utils from "./utils";
// import { RecipientType, IPendingDeploy } from "./types";
// const axios = require("axios").default;

class LIQUIDITYClient {
	private contractHash: string;
	private contractPackageHash: string;

	private isListenin; // paymentAmount,
	g = false;
	// private pendingDeploys: IPendingDeploy[] = [];

	constructor(
		private nodeAddress: string,
		private chainName: string // private eventStreamAddress?: string
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
		const runtimeArgs = RuntimeArgs.fromMap({
			using_provable: CLValueBuilder.string(usingProvable),
			wise_token: CLValueBuilder.string(wiseToken),
			uniswap_pair: CLValueBuilder.string(uniswapPair),
			contract_name: CLValueBuilder.string(contractName),
			// fee_to: utils.createRecipientAddress(feeTo),
			// fee_to_setter: utils.createRecipientAddress(feeToSetter),
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
		investmentDays: string,
		referralAddress: string,
		amount: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async reserveWiseWithToken(
		tokenAddress: string,
		investmentDays: string,
		referralAddress: string,
		tokenAmount: string,
		keys: Keys.AsymmetricKey,
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
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async reserveWise(
		investmentDays: string,
		referralAddress: string,
		senderAddress: string,
		senderValue: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const senderAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(senderAddress, "hex"))
		);

		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async addBalance(
		senderAddress: string,
		investmentDays: string,
		investmentBalance: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const senderAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(senderAddress, "hex"))
		);

		const runtimeArgs = RuntimeArgs.fromMap({
			sender_address: CLValueBuilder.key(senderAdd),
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async generateSupply(
		investmentDays: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async generateStaticSupply(
		investmentDays: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async generateRandomSupply(
		investmentDays: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async callBack(
		queryId: string,
		results: string,
		proofs: string,
		keys: Keys.AsymmetricKey,
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async prepareReferralBonuses(
		referralBatchFrom: string,
		referralBatchTo: string,
		keys: Keys.AsymmetricKey,
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async fullReferralBonus(
		referralAddress: string,
		referralAmount: string,
		ratios: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			referral_address: CLValueBuilder.key(referralAdd),
			referral_amount: CLValueBuilder.u256(referralAmount),
			ratio: CLValueBuilder.u256(ratios),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async familyReferralBonus(
		referralAddress: string,
		ratios: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const referralAdd = new CLByteArray(
			Uint8Array.from(Buffer.from(referralAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			referral_address: CLValueBuilder.key(referralAdd),
			ratio: CLValueBuilder.u256(ratios),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async payoutInvestmentDayBatch(
		investmentDays: string,
		investorBatchFrom: string,
		investorBatchTo: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_day: CLValueBuilder.u256(investmentDays),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async payoutReferralBatch(
		referralBatchFrom: string,
		referralBatchTo: string,
		keys: Keys.AsymmetricKey,
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async checkInvestmentDays(
		investmentDays: string,
		currentWiseDay: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			investment_days: CLValueBuilder.u256(investmentDays),
			current_wise_day: CLValueBuilder.u256(currentWiseDay),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "current_wise_day",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async requestTeamFunds(
		Amount: string,
		teamAddressPurse: string,
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			amount: CLValueBuilder.u256(Amount),
			team_address_purse: CLValueBuilder.uref(teamAddressPurse),
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
			// this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
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
	// 		this.addPendingDeploy(FACTORYEvents.SetFeeTo, deployHash);
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
