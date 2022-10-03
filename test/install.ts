import { config } from "dotenv";
config();
import {
	LIQUIDITYClient,
	utils,
	constants,
} from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import { Keys } from "casper-js-sdk";

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	WASM_PATH,
	MASTER_KEY_PAIR_PATH,
	INSTALL_PAYMENT_AMOUNT,
	CONTRACT_NAME,
	AMOUNT,
	WCSPR_PACKAGE_HASH,
	SYNTHETIC_CSPR_PACKAGE_HASH,
	PAIR_PACKAGE_HASH,
	ROUTER_PACKAGE_HASH,
	WISETOKEN_PACKAGE_HASH,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const test = async () => {
	const liquidity = new LIQUIDITYClient(
		NODE_ADDRESS!,
		CHAIN_NAME!,
		EVENT_STREAM_ADDRESS!
	);

	const installDeployHash = await liquidity.install(
		KEYS,
		AMOUNT!,
		WCSPR_PACKAGE_HASH!,
		SYNTHETIC_CSPR_PACKAGE_HASH!,
		PAIR_PACKAGE_HASH!,
		ROUTER_PACKAGE_HASH!,
		WISETOKEN_PACKAGE_HASH!,
		CONTRACT_NAME!,
		INSTALL_PAYMENT_AMOUNT!,
		WASM_PATH!
	);

	console.log(`... Contract installation deployHash: ${installDeployHash}`);

	await getDeploy(NODE_ADDRESS!, installDeployHash);

	console.log(`... Contract installed successfully.`);

	let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

	console.log(`... Account Info: `);
	console.log(JSON.stringify(accountInfo, null, 2));

	const contractHash = await utils.getAccountNamedKeyValue(
		accountInfo,
		`${CONTRACT_NAME!}_contract_hash`
	);

	console.log(`... Contract Hash: ${contractHash}`);

	const packageHash = await utils.getAccountNamedKeyValue(
		accountInfo,
		`${CONTRACT_NAME!}_package_hash`
	);

	console.log(`... Package Hash: ${packageHash}`);
};

test();
