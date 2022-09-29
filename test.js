require("dotenv").config();
var { request } = require("graphql-request");

async function RefundIssued(refundedTo, amount, deployHash) {
  console.log("Calling handleRefundIssued mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleRefundIssued( $refundedTo: String!, $amount: String!, $deployHash: String!){
            handleRefundIssued( refundedTo: $refundedTo, amount: $amount, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      refundedTo: refundedTo,
      amount: amount,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function CashBackIssued(
  totalCashBack,
  senderAddress,
  senderValue,
  cashBackAmount,
  deployHash
) {
  console.log("Calling handleCashBackIssued mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleCashBackIssued( $totalCashBack:String!,$senderAddress: String!, $senderValue: String!,$cashBackAmount: String!, $deployHash: String!){
            handleCashBackIssued( totalCashBack:$totalCashBack, senderAddress: $senderAddress, senderValue: $ senderValue, cashBackAmount: $ cashBackAmount, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      totalCashBack: totalCashBack,
      senderAddress: senderAddress,
      senderValue: senderValue,
      cashBackAmount: cashBackAmount,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function UniswapSwapedResult(
  amountTokenA,
  amountTokenB,
  liquidity,
  deployHash
) {
  console.log("Calling handleUniswapSwapedResult mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleUniswapSwapedResult( $amountTokenA:String!,$ amountTokenB: String!, $liquidity: String!,$deployHash: String!){
            handleUniswapSwapedResult( amountTokenA:$amountTokenA,  amountTokenB: $ amountTokenB, liquidity: $ liquidity, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      amountTokenA: amountTokenA,
      amountTokenB: amountTokenB,
      liquidity: liquidity,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function UniswapReserves(reserveA, reserveB, blockTimestampLast) {
  console.log("Calling handleUniswapReserves mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleUniswapReserves( $reserveA:String!,$ reserveB: String!, $blockTimestampLast: String!){
            handleUniswapReserves( reserveA:$reserveA,  reserveB: $ reserveB, blockTimestampLast: $ blockTimestampLast) {
              result
          }
                    
          }`,
    {
      reserveA: reserveA,
      reserveB: reserveB,
      blockTimestampLast: blockTimestampLast,
    }
  );
  console.log(response);
}

async function LiquidityGuardStatus(liquidityGuardStatusString) {
  let liquidityGuardStatus = false;
  if (liquidityGuardStatusString == "true") {
    liquidityGuardStatus = true;
  } else {
    liquidityGuardStatus = false;
  }
  console.log("Calling handleLiquidityGuardStatus mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleLiquidityGuardStatus( $liquidityGuardStatus:Boolean!){
            handleLiquidityGuardStatus( liquidityGuardStatus:$liquidityGuardStatus) {
              result
          }
                    
          }`,
    {
      liquidityGuardStatus: liquidityGuardStatus,
    }
  );
  console.log(response);
}
async function GiveStatus(referrerId) {
  console.log("Calling handleGiveStatus mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleGiveStatus( $referrerId: String!){
      handleGiveStatus( referrerId: $referrerId) {
              result
          }
                    
          }`,
    {
      referrerId: referrerId,
    }
  );
  console.log(response);
}

async function StakeStart(
  stakerAddress,
  referralAddress,
  referralShares,
  stakeID,
  stakedAmount,
  stakesShares,
  startDay,
  lockDays,
  daiEquivalent
) {
  console.log("Calling handleStakeStart mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleStakeStart( 
      $stakerAddress: String!,
      $referralAddress: String!,
      $referralShares: String!,
      $stakeID: String!,
      $stakedAmount: String!,
      $stakesShares: String!,
      $startDay: String!,
      $lockDays: String!,
      $daiEquivalent: String!
      ){
      handleStakeStart( 
        stakerAddress:$stakerAddress,
        referralAddress:$referralAddress,
        referralShares: $referralShares,
        stakeID:$stakeID,
        stakedAmount:$stakedAmount,
        stakesShares:$stakesShares,
        startDay:$startDay,
        lockDays:$lockDays,
        daiEquivalent:$daiEquivalent
        ) {
              result
          }
                    
          }`,
    {
      stakerAddress: stakerAddress,
      referralAddress: referralAddress,
      referralShares: referralShares,
      stakeID: stakeID,
      stakedAmount: stakedAmount,
      stakesShares: stakesShares,
      startDay: startDay,
      lockDays: lockDays,
      daiEquivalent: daiEquivalent,
    }
  );
  console.log(response);
}

async function StakeEnd(stakeID, closeDay, rewardAmount, penaltyAmount) {
  console.log("Calling handleStakeEnd mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleStakeEnd( $stakeID: String!, $closeDay: String!, $rewardAmount: String!,$penaltyAmount:String!){
      handleStakeEnd( stakeID: $stakeID, closeDay: $closeDay, rewardAmount: $rewardAmount,penaltyAmount:$penaltyAmount) {
              result
          }
                    
          }`,
    {
      stakeID: stakeID,
      closeDay: closeDay,
      rewardAmount: rewardAmount,
      penaltyAmount: penaltyAmount,
    }
  );
  console.log(response);
}

async function InterestScraped(
  stakeID,
  scrapeDay,
  scrapeAmount,
  stakersPenalty,
  referrerPenalty
) {
  console.log("Calling handleInterestScraped mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleInterestScraped(  
      $stakeID:String!,
      $scrapeDay:String!,
      $scrapeAmount:String!,
      $stakersPenalty:String!,
      $referrerPenalty:String!
      ){
      handleInterestScraped( 
        stakeID:$stakeID,
        scrapeDay:$scrapeDay,
        scrapeAmount:$scrapeAmount,
        stakersPenalty:$stakersPenalty,
        referrerPenalty:$referrerPenalty
        ) {
              result
          }
                    
          }`,
    {
      stakeID: stakeID,
      scrapeDay: scrapeDay,
      scrapeAmount: scrapeAmount,
      stakersPenalty: stakersPenalty,
      referrerPenalty: referrerPenalty,
    }
  );
  console.log(response);
}

async function NewGlobals(
  totalShares,
  totalStaked,
  shareRate,
  referrerShares,
  currentWiseDay,
  wiseAddress,
  UNISWAP_PAIR
) {
  console.log("Calling handleNewGlobals mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleNewGlobals( 
      $totalShares: String!, 
      $totalStaked: String!, 
      $shareRate: String!, 
      $referrerShares: String!, 
      $currentWiseDay: String!, 
      $wiseAddress: String!, 
      $UNISWAP_PAIR: String!)
      {
      handleNewGlobals( 
        totalShares: $totalShares, 
        totalStaked: $totalStaked, 
        shareRate: $shareRate,
        referrerShares: $referrerShares,
        currentWiseDay: $currentWiseDay,
        wiseAddress: $wiseAddress,
        UNISWAP_PAIR: $UNISWAP_PAIR) {
              result
          }
                    
          }`,
    {
      totalShares: totalShares,
      totalStaked: totalStaked,
      shareRate: shareRate,
      referrerShares: referrerShares,
      currentWiseDay: currentWiseDay,
      wiseAddress: wiseAddress,
      UNISWAP_PAIR: UNISWAP_PAIR,
    }
  );
  console.log(response);
}

async function NewSharePrice(newSharePrice, oldSharePrice) {
  console.log("Calling handleNewSharePrice mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleNewSharePrice( $newSharePrice: String!, $oldSharePrice: String!){
      handleNewSharePrice( newSharePrice: $newSharePrice, oldSharePrice: $oldSharePrice) {
              result
          }
                    
          }`,
    {
      newSharePrice: newSharePrice,
      oldSharePrice: oldSharePrice,
    }
  );
  console.log(response);
}

async function ReferralAdded(
  deployHash,
  blockHash,
  timestamp,
  from,
  referral,
  referee,
  amount
) {
  console.log("Calling handleReferralAdded mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleReferralAdded( 
      $deployHash:String!,
      $blockHash:String!,
      $timestamp:String!,
      $from:String!,
      $referral:String!,
      $referee:String!,
      $amount:String!
      ){
      handleReferralAdded( 
        deployHash:$deployHash,
        blockHash:$blockHash,
        timestamp:$timestamp,
        from:$from,
        referral:$referral,
        referee:$referee,
        amount:$amount
        ) {
              result
          }
                    
          }`,
    {
      deployHash: deployHash,
      blockHash: blockHash,
      timestamp: timestamp,
      from: from,
      referral: referral,
      referee: referee,
      amount: amount,
    }
  );
  console.log(response);
}

async function WiseReservation(
  deployHash,
  blockHash,
  timestamp,
  from,
  amount,
  tokens,
  currentWiseDay,
  investmentMode
) {
  console.log("Calling handleWiseReservation mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleWiseReservation( 
        $deployHash:String!,
        $blockHash:String!,
        $timestamp:String!,
        $from:String!,
        $amount:String!,
        $tokens:String!,,
        $currentWiseDay:String!,,
        $investmentMode:String!,
        ){
        handleWiseReservation( 
        deployHash:$deployHash,
        blockHash:$blockHash,
        timestamp:$timestamp,
        from:$from,
        amount:$amount,
        tokens:$tokens,
        currentWiseDay:$currentWiseDay,
        investmentMode:$investmentMode,
        ) {
                result
            }
                      
            }`,
    {
      deployHash: deployHash,
      blockHash: blockHash,
      timestamp: timestamp,
      from: from,
      amount: amount,
      tokens: tokens,
      currentWiseDay: currentWiseDay,
      investmentMode: investmentMode,
    }
  );
  console.log(response);
}

async function DepositedLiquidity(user, amount, deployHash) {
  console.log("Calling handleDepositedLiquidity mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleDepositedLiquidity( $user: String!, $amount: String!, $deployHash: String!){
            handleDepositedLiquidity( user: $user, amount: $amount, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      user: user,
      amount: amount,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function Withdrawal(user, amount, deployHash) {
  console.log("Calling handleWithdrawal mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleWithdrawal( $user: String!, $amount: String!, $deployHash: String!){
            handleWithdrawal( user: $user, amount: $amount, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      user: user,
      amount: amount,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function FormedLiquidity(
  coverAmount,
  amountTokenA,
  amountTokenB,
  liquidity,
  deployHash
) {
  console.log("Calling handleFormedLiquidity mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleFormedLiquidity( $ coverAmount:String! ,$amountTokenA:String!,$ amountTokenB: String!, $liquidity: String!,$deployHash: String!){
            handleFormedLiquidity( coverAmount:$coverAmount, amountTokenA:$amountTokenA,  amountTokenB: $ amountTokenB, liquidity: $ liquidity, deployHash: $deployHash) {
              result
          }
                    
          }`,
    {
      coverAmount: coverAmount,
      amountTokenA: amountTokenA,
      amountTokenB: amountTokenB,
      liquidity: liquidity,
      deployHash: deployHash,
    }
  );
  console.log(response);
}

async function LiquidityAdded(amountWcspr, amountScspr, liquidity) {
  console.log("Calling handleLiquidityAdded mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleLiquidityAdded( $amountWcspr: String!, $amountScspr: String!, $liquidity: String!){
            handleLiquidityAdded( amountWcspr: $amountWcspr, amountScspr: $amountScspr, liquidity: $liquidity) {
              result
          }
                    
          }`,
    {
      amountWcspr: amountWcspr,
      amountScspr: amountScspr,
      liquidity: liquidity,
    }
  );
  console.log(response);
}

async function LiquidityRemoved(amountWcspr, amountScspr, liquidity) {
  console.log("Calling handleLiquidityRemoved mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleLiquidityRemoved( $amountWcspr: String!, $amountScspr: String!){
            handleLiquidityRemoved( amountWcspr: $amountWcspr, amountScspr: $amountScspr) {
              result
          }
                    
          }`,
    {
      amountWcspr: amountWcspr,
      amountScspr: amountScspr,
    }
  );
  console.log(response);
}

async function MasterRecord(masterAddress, amount, source) {
  console.log("Calling handleMasterRecord mutation...");
  let response = await request(
    process.env.GRAPHQL,
    `mutation handleMasterRecord( $masterAddress: String!, $amount: String!, $source: String!){
            handleMasterRecord( masterAddress: $masterAddress, amount: $amount, source: $source) {
              result
          }
                    
          }`,
    {
      masterAddress: masterAddress,
      amount: amount,
      source: source,
    }
  );
  console.log(response);
}

async function startTests() {
  await DepositedLiquidity("123", "10000000000", "123");
  await Withdrawal("123", "10000000000", "123");
  await FormedLiquidity(
    "10000000000",
    "10000000000",
    "1000000000",
    "1000000000000",
    "123"
  );
  await LiquidityAdded("1000000000", "10000000000", "10000000000");
  await LiquidityRemoved("1000000000", "10000000000",);
  await MasterRecord("123", "10000000000", "profit");
  await UniswapSwapedResult(
    "10000000000",
    "100000000000",
    "10000000000000",
    "123"
  );
  await UniswapReserves("10000000000", "1000000000", "1000000000000");
  await LiquidityGuardStatus("true");
  await GiveStatus("123");
  await StakeStart(
    "123",
    "123",
    "100000000000",
    "123",
    "10000000000",
    "100000000000",
    "15000000000",
    "15000000000",
    "123"
  );
  await StakeEnd("123", "15000000000", "10000000000", "10000000000");
  await InterestScraped(
    "123",
    "15000000000",
    "10000000000",
    "1000000000",
    "1000000000"
  );
  await NewGlobals(
    "100000000000",
    "10000000000",
    "1000000000",
    "100000000000",
    "15000000000",
    "2c4275cc575806d7c5108635aa70aa82bee52d02a368bc765d700943ff082a8a",
    "52c5469146d177dee3934aec78b074936441516878c5b0d7fee4a123c1f00ec1"
  );
  await NewSharePrice("10000000000000", "100000000000");
  await WiseReservation(
    "123",
    "123",
    "123",
    "123",
    "15000000000",
    "10000000000",
    "13",
    "15"
  );
  await RefundIssued("123", "10000000000", "123");
  await CashBackIssued(
    "100000000000000000",
    "123",
    "10000000000",
    "10000000000",
    "123"
  );
  //await ReferralAdded("123", "123", "123", "123", "123", "123", "10000000000");
}

//startTests();
