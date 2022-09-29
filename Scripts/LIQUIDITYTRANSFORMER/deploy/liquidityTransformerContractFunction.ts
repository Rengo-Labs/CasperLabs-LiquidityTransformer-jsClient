import { config } from "dotenv";
config();
import { LIQUIDITYClient, utils, constants } from "../../../JsClients/LIQUIDITYTRANSFORMER/src";
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
} from "casper-js-sdk";

const { LIQUIDITYEvents } = constants;

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	LIQUIDITYTRANSFORMER_WASM_PATH,
	LIQUIDITYTRANSFORMER_MASTER_KEY_PAIR_PATH,
	RECEIVER_ACCOUNT_ONE,
	INSTALL_PAYMENT_AMOUNT,
	SET_FEE_TO_PAYMENT_AMOUNT,
	SET_FEE_TO_SETTER_PAYMENT_AMOUNT,
	CREATE_PAIR_PAYMENT_AMOUNT,
	LIQUIDITYTRANSFORMER_CONTRACT_NAME,
	TOKEN0_CONTRACT,
	TOKEN1_CONTRACT,
	// PAIR_CONTRACT,
	RESERVE_WISE_PAYMENT_AMOUNT,
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
	LIQUIDITYTRANSFORMER_CONTRACT_HASH,
	INVESTMENT_MODE,
	MSG_VALUE,
	CALLER_PURSE,
	WISETOKEN_CONTRACT_HASH,
	PAIR_CONTRACT_HASH,
	SYNTHETIC_CSPR_PACKAGE
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${LIQUIDITYTRANSFORMER_MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${LIQUIDITYTRANSFORMER_MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const liquidity = new LIQUIDITYClient(
	NODE_ADDRESS!,
	CHAIN_NAME!,
	EVENT_STREAM_ADDRESS!
);

const test = async () => {

	// We don't need hash- prefix so i'm removing it
	await liquidity.setContractHash(LIQUIDITYTRANSFORMER_CONTRACT_HASH!);

	console.log("Liquidity Transformer contract Hash: ", LIQUIDITYTRANSFORMER_CONTRACT_HASH!);

	//first mint tokens in wise contract
	//reserve_wise
	const _reserve_Wise = await liquidity.reserve_Wise(
		KEYS,
		INVESTMENT_MODE!,
		MSG_VALUE!,
		CALLER_PURSE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... _reserve_Wise deploy hash: ", _reserve_Wise);

	await getDeploy(NODE_ADDRESS!, _reserve_Wise);
	console.log("... _reserve_Wise called successfully");

	//call mint and approve in erc20 first
	//reserve_wise_with_token
	// const reserveWiseWithToken = await liquidity.reserveWiseWithToken(
	// 	KEYS,
	// 	TOKEN1_CONTRACT!,
	// 	AMOUNT!,
	// 	INVESTMENT_MODE!,
	// 	CALLER_PURSE!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... reserveWiseWithToken deploy hash: ", reserveWiseWithToken);
	// await getDeploy(NODE_ADDRESS!, reserveWiseWithToken);
	// console.log("... reserveWiseWithToken called successfully");

	// //requestRefund
	// const requestRefund = await liquidity.requestRefund(
	// 	KEYS,
	// 	CALLER_PURSE!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log(`... requestRefund deploy hash: ${requestRefund}`);

	// await getDeploy(NODE_ADDRESS!, requestRefund);
	// console.log("... requestRefund called successfully");

	// call set_liquidity_transfomer
	// call set_wise
	// call erc20 mint against scspr_package
	// call approve of scspr against router_package
	// call erc20 mint against pair_package
	// call erc20 2 mint against scspr_package
	// call erc20 2 mint against pair_package
	// call pair initialize function
	// call pair sync method
	//forwardliquidity
	// const forwardLiquidity = await liquidity.forwardLiquidity(
	// 	KEYS,
	// 	CALLER_PURSE!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... forwardLiquidity deploy hash: ", forwardLiquidity);
	// await getDeploy(NODE_ADDRESS!, forwardLiquidity);
	// console.log("... forwardLiquidity called successfully");

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

test();
