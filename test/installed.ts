import { config } from "dotenv";
config();
import {
	LIQUIDITYClient,
	utils,
	constants,
} from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import {
	CLValueBuilder,
	Keys,
	CLPublicKey,
	CLAccountHash,
	CLPublicKeyType,
	CLURef,
	decodeBase16,
	AccessRights,
	RuntimeArgs,
} from "casper-js-sdk";

const { LIQUIDITYEvents } = constants;

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	MASTER_KEY_PAIR_PATH,
	CONTRACT_HASH,
	PACKAGE_HASH,
	RECEIVER_ACCOUNT_ONE,
	INSTALL_PAYMENT_AMOUNT,
	SET_FEE_TO_PAYMENT_AMOUNT,
	SET_FEE_TO_SETTER_PAYMENT_AMOUNT,
	CREATE_PAIR_PAYMENT_AMOUNT,
	LIQUIDITYTRANSFORMER_CONTRACT_NAME,
	TOKEN0_CONTRACT,
	TOKEN_CONTRACT,
	RESERVE_WISE_PAYMENT_AMOUNT,
	RESERVE_WISE_WITH_TOKEN_PAYMENT_AMOUNT,
	FORWARD_LIQUIDITY_PAYMENT_AMOUNT,
	REQUEST_REFUND_PAYMENT_AMOUNT,
	INVESTMENT_DAY,
	INVESTMENT_DAYS,
	INVESTMENT_BALANCE,
	AMOUNT,
	REFERAL_ADDRESS,
	SENDER_ADDRESS,
	SENDER_VALUE,
	QUERY_ID,
	RESULTS,
	PROOFS,
	REFERAL_BATCH_FROM,
	REFERAL_BATCH_TO,
	REFERAL_AMOUNT,
	RATIO,
	INVESTOR_BATCH_FROM,
	INVESTOR_BATCH_TO,
	CURRENT_WISE_DAY,
	TEAM_ADDRESS_PURSE,
	INVESTOR_ADDRESS,
	TEAM_AMOUNT,
	SUCCESOR_PURSE,
	INVESTMENT_MODE,
	MSG_VALUE,
	CALLER_PURSE,
	WISETOKEN_CONTRACT_HASH,
	PAIR_CONTRACT_HASH,
	SYNTHETIC_CSPR_PACKAGE,
	SESSION_WASM_PATH
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

	/* Request Refund */
	// -- Prerequisite Calls --
	// reserve_wise		liquidity_transfomer
	const requestRefund = await liquidity.requestRefund(
		KEYS,
		PACKAGE_HASH!,
		SESSION_WASM_PATH!,
		REQUEST_REFUND_PAYMENT_AMOUNT!
	);
	console.log(`... requestRefund deploy hash: ${requestRefund}`);
	await getDeploy(NODE_ADDRESS!, requestRefund);
	console.log("... requestRefund called successfully");

	// // --- set_settings ---
	// const _setSettings = await liquidity.setSettings(
	// 	KEYS,
	// 	WISETOKEN_CONTRACT_HASH!,
	// 	PAIR_CONTRACT_HASH!,
	// 	SYNTHETIC_CSPR_PACKAGE!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... _setSettings deploy hash: ", _setSettings);
	// await getDeploy(NODE_ADDRESS!, _setSettings);
	// console.log("... _setSettings called successfully");
	// // --- get_my_tokens ---
	// const getMyTokens = await liquidity.getMyTokens(
	// 	KEYS,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... getMyTokens deploy hash: ", getMyTokens);
	// await getDeploy(NODE_ADDRESS!, getMyTokens);
	// console.log("... getMyTokens created successfully");
	// /*=========================Getters=========================*/
	// const INVESTMENTDAY = CLValueBuilder.u256(INVESTMENT_DAY);
	// const TEAMAMOUNT = CLValueBuilder.u256(TEAM_AMOUNT);
	// const payoutInvestorAddress = await liquidity.payoutInvestorAddress(
	// 	KEYS.publicKey
	// );
	// console.log(`... Contract payoutInvestorAddress: ${payoutInvestorAddress}`);
	// const preparePath = await liquidity.preparePath(KEYS.publicKey);
	// console.log(`... Contract allpairs: ${preparePath}`);
	// const currentWiseDay = await liquidity.currentWiseDay();
	// console.log(`... currentWiseDay : ${currentWiseDay}`);
};

// test();