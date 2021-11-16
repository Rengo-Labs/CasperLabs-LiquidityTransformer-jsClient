import { config } from "dotenv";
config();
import { LIQUIDITYClient, utils, constants } from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import {
	CLValueBuilder,
	Keys,
	CLPublicKey,
	CLAccountHash,
	CLPublicKeyType,
} from "casper-js-sdk";

const { LIQUIDITYEvents } = constants;

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	WASM_PATH,
	MASTER_KEY_PAIR_PATH,
	RECEIVER_ACCOUNT_ONE,
	INSTALL_PAYMENT_AMOUNT,
	SET_FEE_TO_PAYMENT_AMOUNT,
	SET_FEE_TO_SETTER_PAYMENT_AMOUNT,
	CREATE_PAIR_PAYMENT_AMOUNT,
	CONTRACT_NAME,
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

	// const listener = liquidity.onEvent(
	// 	[
	// 		LIQUIDITYEvents.SetFeeTo,
	// 		LIQUIDITYEvents.SetFeeToSetter,
	// 		LIQUIDITYEvents.CreatePair,
	// 	],
	// 	(eventName, deploy, result) => {
	// 		if (deploy.success) {
	// 			console.log(
	// 				`Successfull deploy of: ${eventName}, deployHash: ${deploy.deployHash}`
	// 			);
	// 			console.log(result.value());
	// 		} else {
	// 			console.log(
	// 				`Failed deploy of ${eventName}, deployHash: ${deploy.deployHash}`
	// 			);
	// 			console.log(`Error: ${deploy.error}`);
	// 		}
	// 	}
	// );

	await sleep(5 * 1000);

	let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

	console.log(`... Account Info: `);
	console.log(JSON.stringify(accountInfo, null, 2));

	const contractHash = await utils.getAccountNamedKeyValue(
		accountInfo,
		`${CONTRACT_NAME!}_contract_hash`
	);

	console.log(`... Contract Hash: ${contractHash}`);

	// We don't need hash- prefix so i'm removing it
	// await liquidity.setContractHash(contractHash.slice(5));

	const _reserve_Wise = await liquidity._reserve_Wise(
		KEYS,
		INVESTMENT_DAYS!,
		TOKEN1_CONTRACT!,
		AMOUNT!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... _reserve_Wise deploy hash: ", _reserve_Wise);
	await getDeploy(NODE_ADDRESS!, _reserve_Wise);
	console.log("... _reserve_Wise created successfully");

	const reserveWiseWithToken = await liquidity.reserveWiseWithToken(
		KEYS,
		TOKEN1_CONTRACT!,
		AMOUNT!,
		INVESTMENT_DAYS!,
		REFERAL_ADDRESS!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... reserveWiseWithToken deploy hash: ", reserveWiseWithToken);
	await getDeploy(NODE_ADDRESS!, reserveWiseWithToken);
	console.log("... reserveWiseWithToken created successfully");

	const reserveWise = await liquidity.reserveWise(
		KEYS,
		INVESTMENT_DAYS!,
		REFERAL_ADDRESS!,
		SENDER_ADDRESS!,
		SENDER_VALUE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... reserveWise deploy hash: ", reserveWise);
	await getDeploy(NODE_ADDRESS!, reserveWise);
	console.log("... reserveWise createINVESTMENT_DAYd successfully");

	const addBalance = await liquidity.addBalance(
		KEYS,
		SENDER_ADDRESS!,
		INVESTMENT_DAY!,
		INVESTMENT_BALANCE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... addBalance deploy hash: ", addBalance);
	await getDeploy(NODE_ADDRESS!, reserveWise);
	console.log("... addBalance created successfully");

	const generateSupply = await liquidity.generateSupply(
		KEYS,
		INVESTMENT_DAY!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... generateSupply deploy hash: ", generateSupply);
	await getDeploy(NODE_ADDRESS!, generateSupply);
	console.log("... generateSupply created successfully");

	const generateStaticSupply = await liquidity.generateStaticSupply(
		KEYS,
		INVESTMENT_DAY!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... generateStaticSupply deploy hash: ", generateStaticSupply);
	await getDeploy(NODE_ADDRESS!, generateStaticSupply);
	console.log("... generateStaticSupply created successfully");

	const generateRandomSupply = await liquidity.generateRandomSupply(
		KEYS,
		INVESTMENT_DAY!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... generateRandomSupply deploy hash: ", generateRandomSupply);
	await getDeploy(NODE_ADDRESS!, generateRandomSupply);
	console.log("... generateRandomSupply created successfully");

	const callBack = await liquidity.callBack(
		KEYS,
		QUERY_ID!,
		RESULTS!,
		PROOFS!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... callBack deploy hash: ", callBack);
	await getDeploy(NODE_ADDRESS!, callBack);
	console.log("... callBack created successfully");

	const timeOut = await liquidity.timeOut(KEYS, RESERVE_WISE_PAYMENT_AMOUNT!);
	console.log("... timeOut deploy hash: ", timeOut);
	await getDeploy(NODE_ADDRESS!, timeOut);
	console.log("... timeOut created successfully");

	const prepareReferralBonuses = await liquidity.prepareReferralBonuses(
		KEYS,
		REFERAL_BATCH_FROM!,
		REFERAL_BATCH_TO!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log(
		"... prepareReferralBonuses deploy hash: ",
		prepareReferralBonuses
	);
	await getDeploy(NODE_ADDRESS!, prepareReferralBonuses);
	console.log("... prepareReferralBonuses created successfully");

	const fullReferralBonus = await liquidity.fullReferralBonus(
		KEYS,
		REFERAL_ADDRESS!,
		REFERAL_AMOUNT!,
		RATIO!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... fullReferralBonus deploy hash: ", fullReferralBonus);
	await getDeploy(NODE_ADDRESS!, fullReferralBonus);
	console.log("... fullReferralBonus created successfully");

	const familyReferralBonus = await liquidity.familyReferralBonus(
		KEYS,
		REFERAL_ADDRESS!,
		RATIO!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... familyReferralBonus deploy hash: ", familyReferralBonus);
	await getDeploy(NODE_ADDRESS!, familyReferralBonus);
	console.log("... familyReferralBonus created successfully");

	const forwardLiquidity = await liquidity.forwardLiquidity(
		KEYS,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... forwardLiquidity deploy hash: ", forwardLiquidity);
	await getDeploy(NODE_ADDRESS!, forwardLiquidity);
	console.log("... forwardLiquidity created successfully");

	const getMyTokens = await liquidity.getMyTokens(
		KEYS,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... getMyTokens deploy hash: ", getMyTokens);
	await getDeploy(NODE_ADDRESS!, getMyTokens);
	console.log("... getMyTokens created successfully");

	const payoutInvestmentDayBatch = await liquidity.payoutInvestmentDayBatch(
		KEYS,
		INVESTMENT_DAY!,
		INVESTOR_BATCH_FROM!,
		INVESTOR_BATCH_TO!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log(
		"... payoutInvestmentDayBatch deploy hash: ",
		payoutInvestmentDayBatch
	);
	await getDeploy(NODE_ADDRESS!, payoutInvestmentDayBatch);
	console.log("... payoutInvestmentDayBatch created successfully");

	const payoutReferralBatch = await liquidity.payoutReferralBatch(
		KEYS,
		REFERAL_BATCH_FROM!,
		REFERAL_BATCH_TO!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... payoutReferralBatch deploy hash: ", payoutReferralBatch);
	await getDeploy(NODE_ADDRESS!, payoutReferralBatch);
	console.log("... payoutReferralBatch created successfully");

	const checkInvestmentDays = await liquidity.checkInvestmentDays(
		KEYS,
		INVESTMENT_DAYS!,
		CURRENT_WISE_DAY!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... checkInvestmentDays deploy hash: ", checkInvestmentDays);
	await getDeploy(NODE_ADDRESS!, checkInvestmentDays);
	console.log("... checkInvestmentDays created successfully");

	const requestTeamFunds = await liquidity.requestTeamFunds(
		KEYS,
		AMOUNT!,
		TEAM_ADDRESS_PURSE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... requestTeamFunds deploy hash: ", requestTeamFunds);
	await getDeploy(NODE_ADDRESS!, requestTeamFunds);
	console.log("... requestTeamFunds created successfully");

	/*=========================Getters=========================*/

	const payoutInvestorAddress = await liquidity.payoutInvestorAddress(
		KEYS.publicKey
	);
	console.log(`... Contract payoutInvestorAddress: ${payoutInvestorAddress}`);

	const payoutReferralAddress = await liquidity.payoutReferralAddress(
		KEYS.publicKey
	);
	console.log(`... Contract payoutReferralAddress: ${payoutReferralAddress}`);

	const myInvestmentAmount = await liquidity.myInvestmentAmount(INVESTMENT_DAY);
	console.log(`... Contract allpairs: ${myInvestmentAmount}`);

	const myInvestmentAmountAllDays = await liquidity.myInvestmentAmountAllDays();
	console.log(`... Contract allpairs: ${myInvestmentAmountAllDays}`);

	const myTotalInvestmentAmount = await liquidity.myTotalInvestmentAmount();
	console.log(`... Contract allpairs: ${myTotalInvestmentAmount}`);

	const investorsOnDay = await liquidity.investorsOnDay(INVESTMENT_DAY);
	console.log(`... Contract allpairs: ${investorsOnDay}`);

	const investorsOnAllDays = await liquidity.investorsOnAllDays();
	console.log(`... Contract allpairs: ${investorsOnAllDays}`);

	const investmentsOnAllDays = await liquidity.investmentsOnAllDays();
	console.log(`... Contract allpairs: ${investmentsOnAllDays}`);

	const supplyOnAllDays = await liquidity.supplyOnAllDays();
	console.log(`... Contract allpairs: ${supplyOnAllDays}`);

	const preparePath = await liquidity.preparePath(KEYS.publicKey);
	console.log(`... Contract allpairs: ${preparePath}`);

	const teamContribution = await liquidity.teamContribution(TEAM_AMOUNT);
	console.log(`... Contract allpairs: ${teamContribution}`);

	const fundedDays = await liquidity.fundedDays();
	console.log(`... Contract allpairs: ${fundedDays}`);

	const calculateDailyRatio = await liquidity.calculateDailyRatio(
		INVESTMENT_DAY
	);
	console.log(`... Contract allpairs: ${calculateDailyRatio}`);

	const currentWiseDay = await liquidity.currentWiseDay();
	console.log(`... Contract allpairs: ${currentWiseDay}`);

	const requestRefund = await liquidity.requestRefund(KEYS.publicKey);
	console.log(`... Contract allpairs: ${requestRefund}`);

	//createpair
	// const createpairDeployHash = await liquidity.createPair(
	// 	KEYS,
	// 	TOKEN0_CONTRACT!,
	// 	TOKEN1_CONTRACT!,
	// 	PAIR_CONTRACT!,
	// 	CREATE_PAIR_PAYMENT_AMOUNT!
	// );
	// console.log("... CreatePair deploy hash: ", createpairDeployHash);

	// await getDeploy(NODE_ADDRESS!, createpairDeployHash);
	// console.log("... Pair created successfully");

	// //allpairs
	// const allPairs = await liquidity.allPairs();
	// console.log(`... Contract allpairs: ${allPairs}`);
	// // //allpairslength
	// const allpairslength = await liquidity.allPairsLength();
	// console.log(`... Contract allpairslength: ${allpairslength}`);

	// //pair
	// let pair = await liquidity.getPair(TOKEN0_CONTRACT!, TOKEN1_CONTRACT!);
	// console.log(`... Pair: ${pair}`);

	// //setfeeto
	// const setfeetoDeployHash = await liquidity.setFeeTo(
	// 	KEYS,
	// 	KEYS.publicKey,
	// 	SET_FEE_TO_PAYMENT_AMOUNT!
	// );
	// console.log("... Setfeeto deploy hash: ", setfeetoDeployHash);

	// await getDeploy(NODE_ADDRESS!, setfeetoDeployHash);
	// console.log("... Setfeeto functionality successfull");

	// // feeto
	// const feeto = await liquidity.feeTo();
	// console.log(`... Contract feeto: ${feeto.toString()}`);

	// //setfeetosetter
	// const setfeetosetterDeployHash = await liquidity.setFeeToSetter(
	// 	KEYS,
	// 	KEYS.publicKey,
	// 	SET_FEE_TO_SETTER_PAYMENT_AMOUNT!
	// );
	// console.log(
	// 	"... SetfeetosetterDeployHash deploy hash: ",
	// 	setfeetosetterDeployHash
	// );

	// await getDeploy(NODE_ADDRESS!, setfeetosetterDeployHash);
	// console.log("... SetfeetoSetter functionality successfull");

	// //feetosetter
	// const feeTosSetter = await liquidity.feeToSetter();
	// console.log(`... Contract feetosetter: ${feeTosSetter.toString()}`);
};

test();
