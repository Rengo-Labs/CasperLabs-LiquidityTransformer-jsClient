import { LIQUIDITYClient, utils } from "../src";
import { getDeploy } from "./utils";
import { Keys } from "casper-js-sdk";
import { config } from "dotenv";
config();

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	MASTER_KEY_PAIR_PATH,
	CONTRACT_HASH,
	PACKAGE_HASH,
	SESSION_WASM_PATH,
	RESERVE_WISE_PAYMENT_AMOUNT,
	RESERVE_WISE_WITH_TOKEN_PAYMENT_AMOUNT,
	FORWARD_LIQUIDITY_PAYMENT_AMOUNT,
	GET_MY_TOKENS_PAYMENT_AMOUNT,
	REQUEST_REFUND_PAYMENT_AMOUNT,
	PAYOUT_INVESTOR_ADDRESS_PAYMENT_AMOUNT,
	PREPARE_PATH_PAYMENT_AMOUNT,
	CURRENT_STAKEABLE_DAY_PAYMENT_AMOUNT,
	SET_SETTINGS_PAYMENT_AMOUNT,
	RENOUNCE_KEEPER_PAYMENT_AMOUNT,
	INVESTMENT_MODE,
	MSG_VALUE,
	TOKEN_CONTRACT,
	AMOUNT,
	INVESTOR_ADDRESS,
	WISETOKEN_CONTRACT_HASH,
	PAIR_CONTRACT_HASH,
	SYNTHETIC_CSPR_PACKAGE,
	TOKEN_ADDRESS,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const liquidity = new LIQUIDITYClient(
	NODE_ADDRESS!,
	CHAIN_NAME!,
	EVENT_STREAM_ADDRESS!
);

const test = async () => {
	// We don't need hash- prefix so i'm removing it
	await liquidity.setContractHash(CONTRACT_HASH!);
	console.log("Liquidity Transformer contract Hash: ", CONTRACT_HASH!);

	/* Reserve Wise */
	const reserveWise = await liquidity.reserveWise(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		RESERVE_WISE_PAYMENT_AMOUNT!,
		INVESTMENT_MODE!,
		MSG_VALUE!
	);
	console.log("... reserve wise deploy hash: ", reserveWise);
	await getDeploy(NODE_ADDRESS!, reserveWise);
	console.log("... reserve wise called successfully");

	/* Reserve Wise With Token */
	// -- Prerequisite Calls --
	// add_liquidity	wcspr <=> erc20
	// approve			erc20 => liquidity_transformer
	const reserveWiseWithToken = await liquidity.reserveWiseWithToken(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		RESERVE_WISE_WITH_TOKEN_PAYMENT_AMOUNT!,
		TOKEN_CONTRACT!,
		AMOUNT!,
		INVESTMENT_MODE!,
	);
	console.log("... reserveWiseWithToken deploy hash: ", reserveWiseWithToken);
	await getDeploy(NODE_ADDRESS!, reserveWiseWithToken);
	console.log("... reserveWiseWithToken called successfully");

	/* Forward Liquidity */
	// -- Prerequisite Calls --
	// set_wise						scspr => wise
	// set_white_list				factory => scspr
	// set_white_list				factory => uniswap_router
	// set_white_list				factory => wise
	// define_token					scspr => wise
	// define_helper				scspr => transfer_helper
	// create_pair					wise
	// create_pair					scspr
	// set_liquidity_transfomer		wise
	// reserve_wise					liquidity_transfomer
	const forwardLiquidity = await liquidity.forwardLiquidity(
		KEYS,
		FORWARD_LIQUIDITY_PAYMENT_AMOUNT!,
		PAIR_CONTRACT_HASH!
	);
	console.log("... forwardLiquidity deploy hash: ", forwardLiquidity);
	await getDeploy(NODE_ADDRESS!, forwardLiquidity);
	console.log("... forwardLiquidity called successfully");

	/* Get My Tokens */
	// -- Prerequisite Calls --
	// forward_liquidity		liquidity_transfomer => pair
	const getMyTokens = await liquidity.getMyTokens(
		KEYS,
		GET_MY_TOKENS_PAYMENT_AMOUNT!,
	);
	console.log("... getMyTokens deploy hash: ", getMyTokens);
	await getDeploy(NODE_ADDRESS!, getMyTokens);
	console.log("... getMyTokens called successfully");

	/* Request Refund */
	// -- Prerequisite Calls --
	// reserve_wise			liquidity_transfomer
	const requestRefund = await liquidity.requestRefund(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		REQUEST_REFUND_PAYMENT_AMOUNT!,
	);
	console.log("... requestRefund deploy hash: ", requestRefund);
	await getDeploy(NODE_ADDRESS!, requestRefund);
	console.log("... requestRefund called successfully");

	/* Payout Investor Address */
	// -- Prerequisite Calls --
	// forward_liquidity		liquidity_transfomer => pair
	const payoutInvestorAddress = await liquidity.payoutInvestorAddress(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		PAYOUT_INVESTOR_ADDRESS_PAYMENT_AMOUNT!,
		INVESTOR_ADDRESS!,
	);
	console.log("... payoutInvestorAddress deploy hash: ", payoutInvestorAddress);
	await getDeploy(NODE_ADDRESS!, payoutInvestorAddress);
	console.log("... payoutInvestorAddress called successfully");

	/* Prepare Path */
	const preparePath = await liquidity.preparePath(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		PREPARE_PATH_PAYMENT_AMOUNT!,
		TOKEN_ADDRESS!,
	);
	console.log("... preparePath deploy hash: ", preparePath);
	await getDeploy(NODE_ADDRESS!, preparePath);
	console.log("... preparePath called successfully");

	/* Current Stakeable Day */
	const currentStakeableDay = await liquidity.currentStakeableDay(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		CURRENT_STAKEABLE_DAY_PAYMENT_AMOUNT!
	);
	console.log("... currentStakeableDay deploy hash: ", currentStakeableDay);
	await getDeploy(NODE_ADDRESS!, currentStakeableDay);
	console.log("... currentStakeableDay called successfully");

	/* Set Settings  */
	const setSettings = await liquidity.setSettings(
		KEYS,
		SET_SETTINGS_PAYMENT_AMOUNT!,
		WISETOKEN_CONTRACT_HASH!,
		PAIR_CONTRACT_HASH!,
		SYNTHETIC_CSPR_PACKAGE!,
	);
	console.log("... setSettings deploy hash: ", setSettings);
	await getDeploy(NODE_ADDRESS!, setSettings);
	console.log("... setSettings called successfully");

	/* Renounce Keeper */
	const renounceKeeper = await liquidity.renounceKeeper(
		KEYS,
		RENOUNCE_KEEPER_PAYMENT_AMOUNT!
	);
	console.log("... renounceKeeper deploy hash: ", renounceKeeper);
	await getDeploy(NODE_ADDRESS!, renounceKeeper);
	console.log("... renounceKeeper called successfully");
};

// test();