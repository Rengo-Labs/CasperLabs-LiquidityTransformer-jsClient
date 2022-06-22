# CasperLabs-Wise-LiquidityTransformer-jsClient

## Prerequisite

Make sure you have created, pasted and funded the keys before testing.

## Generate the keys

Paste this command on the ubuntu terminal, that will create a keys folder for you containing public key , public key hex and secret key.

```
casper-client keygen keys

```
## Paste the keys

Paste the keys folder created by the above command to root directory.

## Fund the key

We can fund the keys from casper live website faucet page on testnet.

Link:

```
https://testnet.cspr.live/tools/faucet

```

## Testing

Use the script file in package.json to perform the testing
```
"scripts": {
    "test:install": "ts-node test/install.ts",
    "test:installed": "ts-node test/installed.ts",
  },
```

Use the following commands to perform testing
```
npm run test:install
npm run test:installed

```

* CONFIGURE .env BEFORE TESTING
