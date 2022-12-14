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

class LIQUIDITYClient {
	private contractName: string = "Liquidity_transformer";
	private contractHash: string = "Liquidity_transformer";
	private contractPackageHash: string = "Liquidity_transformer";

	private namedKeys: {
		balances: string;
		metadata: string;
		nonces: string;
		allowances: string;
		ownedTokens: string;
		owners: string;
		paused: string;
	};

	private isListening = false;
	private pendingDeploys: IPendingDeploy[] = [];

	constructor(
		private nodeAddress: string,
		private chainName: string,
		private eventStreamAddress?: string
	) {
		this.namedKeys = {
			balances: "null",
			metadata: "null",
			nonces: "null",
			allowances: "null",
			ownedTokens: "null",
			owners: "null",
			paused: "null",
		};
	}

	public async install(
		keys: Keys.AsymmetricKey,
		amount: string,
		wcsprAddress: string,
		syntheticCsprAddress: string,
		pairAddress: string,
		routerAddress: string,
		wiseToken: string,
		contractName: string,
		paymentAmount: string,
		wasmPath: string
	) {
		const wcspr_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(wcsprAddress, "hex"))
		);
		const scspr_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(syntheticCsprAddress, "hex"))
		);
		const pair_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(pairAddress, "hex"))
		);
		const router_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(routerAddress, "hex"))
		);
		const wiseTokenContractHash = new CLByteArray(
			Uint8Array.from(Buffer.from(wiseToken, "hex"))
		);

		const runtimeArgs = RuntimeArgs.fromMap({
			amount: CLValueBuilder.u512(amount),
			wcspr: CLValueBuilder.key(wcspr_contract),
			scspr: CLValueBuilder.key(scspr_contract),
			uniswap_pair: CLValueBuilder.key(pair_contract),
			uniswap_router: CLValueBuilder.key(router_contract),
			wise_token: CLValueBuilder.key(wiseTokenContractHash),
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

	public async setContractHash(hash: string) {
		const stateRootHash = await utils.getStateRootHash(this.nodeAddress);
		const contractData = await utils.getContractData(
			this.nodeAddress,
			stateRootHash,
			hash
		);
		const { contractPackageHash, namedKeys } = contractData.Contract!;
		this.contractHash = hash;
		this.contractPackageHash = contractPackageHash.replace(
			"contract-package-wasm",
			""
		);
		const LIST_OF_NAMED_KEYS = [
			"balances",
			"nonces",
			"allowances",
			`${this.contractName}_package_hash`,
			`${this.contractName}_package_hash_wrapped`,
			`${this.contractName}_contract_hash`,
			`${this.contractName}_contract_hash_wrapped`,
			`${this.contractName}_package_access_token`,
		];
		// @ts-ignore
		this.namedKeys = namedKeys.reduce((acc, val) => {
			if (LIST_OF_NAMED_KEYS.includes(val.name)) {
				return { ...acc, [utils.camelCased(val.name)]: val.key };
			}
			return acc;
		}, {});
	}

	public async reserveWise(
		keys: Keys.AsymmetricKey,
		packageHash: string,
		sessionWasmPath: string,
		paymentAmount: string,
		investmentMode: string,
		msgValue: string,
	) {
		const ltPackageHash = new CLByteArray(
			Uint8Array.from(Buffer.from(packageHash, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			package_hash: CLValueBuilder.key(ltPackageHash),
			entrypoint: CLValueBuilder.string("reserve_wise"),
			investment_mode: CLValueBuilder.u8(investmentMode),
			amount: CLValueBuilder.u512(msgValue),
		});
		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: sessionWasmPath,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async reserveWiseWithToken(
		keys: Keys.AsymmetricKey,
		packageHash: string,
		sessionWasmPath: string,
		paymentAmount: string,
		tokenAddress: string,
		tokenAmount: string,
		investmentMode: string
	) {
		const ltPackageHash = new CLByteArray(
			Uint8Array.from(Buffer.from(packageHash, "hex"))
		);
		const tokenAddr = new CLByteArray(
			Uint8Array.from(Buffer.from(tokenAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			package_hash: CLValueBuilder.key(ltPackageHash),
			entrypoint: CLValueBuilder.string("reserve_wise_with_token"),
			token_address: CLValueBuilder.key(tokenAddr),
			token_amount: CLValueBuilder.u256(tokenAmount),
			investment_mode: CLValueBuilder.u8(investmentMode),
		});
		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: sessionWasmPath,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async forwardLiquidity(
		keys: Keys.AsymmetricKey,
		paymentAmount: string,
		pair: string
	) {
		const pairHash = new CLByteArray(
			Uint8Array.from(Buffer.from(pair, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			pair: pairHash,
		});
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
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async requestRefund(
		keys: Keys.AsymmetricKey,
		packageHash: string,
		sessionWasmPath: string,
		paymentAmount: string
	) {
		const ltPackageHash = new CLByteArray(
			Uint8Array.from(Buffer.from(packageHash, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			package_hash: CLValueBuilder.key(ltPackageHash),
			entrypoint: CLValueBuilder.string("request_refund"),
		});
		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: sessionWasmPath,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async payoutInvestorAddress(
		keys: Keys.AsymmetricKey,
		packageHash: string,
		sessionWasmPath: string,
		paymentAmount: string,
		investorAddress: string
	) {
		const ltPackageHash = new CLByteArray(
			Uint8Array.from(Buffer.from(packageHash, "hex"))
		);
		const investorAddressHash = new CLByteArray(
			Uint8Array.from(Buffer.from(investorAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			package_hash: CLValueBuilder.key(ltPackageHash),
			entrypoint: CLValueBuilder.string("payout_investor_address"),
			investor_address: CLValueBuilder.key(investorAddressHash),
		});
		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: sessionWasmPath,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async preparePath(
		keys: Keys.AsymmetricKey,
		packageHash: string,
		sessionWasmPath: string,
		paymentAmount: string,
		tokenAddress: string
	) {
		const ltPackageHash = new CLByteArray(
			Uint8Array.from(Buffer.from(packageHash, "hex"))
		);
		const tokenAddressHash = new CLByteArray(
			Uint8Array.from(Buffer.from(tokenAddress, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			package_hash: CLValueBuilder.key(ltPackageHash),
			entrypoint: CLValueBuilder.string("prepare_path"),
			token_address: CLValueBuilder.key(tokenAddressHash),
		});
		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: sessionWasmPath,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async currentStakeableDay(
		keys: Keys.AsymmetricKey,
		packageHash: string,
		sessionWasmPath: string,
		paymentAmount: string
	) {
		const ltPackageHash = new CLByteArray(
			Uint8Array.from(Buffer.from(packageHash, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			package_hash: CLValueBuilder.key(ltPackageHash),
			entrypoint: CLValueBuilder.string("current_stakeable_day"),
		});
		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: sessionWasmPath,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async setSettings(
		keys: Keys.AsymmetricKey,
		paymentAmount: string,
		wiseToken: string,
		uniswapPair: string,
		syntheticCspr: string
	) {
		const wisetoken = new CLByteArray(
			Uint8Array.from(Buffer.from(wiseToken, "hex"))
		);
		const uniswappair = new CLByteArray(
			Uint8Array.from(Buffer.from(uniswapPair, "hex"))
		);
		const syntheticcspr = new CLByteArray(
			Uint8Array.from(Buffer.from(syntheticCspr, "hex"))
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			wise_token: CLValueBuilder.key(wisetoken),
			uniswap_pair: CLValueBuilder.key(uniswappair),
			synthetic_cspr: CLValueBuilder.key(syntheticcspr),
		});
		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "set_settings",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});
		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async renounceKeeper(keys: Keys.AsymmetricKey, paymentAmount: string) {
		const runtimeArgs = RuntimeArgs.fromMap({});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "renounce_keeper",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}
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