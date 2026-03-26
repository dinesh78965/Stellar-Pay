import * as StellarSdk from "stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function fetchXlmBalance(publicKey) {
  if (!publicKey) {
    return "0.0000000";
  }

  const account = await server.loadAccount(publicKey);
  const xlmBalance = account.balances.find(
    (balance) => balance.asset_type === "native"
  );

  return xlmBalance?.balance ?? "0.0000000";
}

export async function sendXlm({
  sourcePublicKey,
  destinationPublicKey,
  amount,
}) {
  if (!sourcePublicKey) {
    throw new Error("Connect your wallet before sending a payment.");
  }

  const sourceAccount = await server.loadAccount(sourcePublicKey);
  const fee = await server.fetchBaseFee();

  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: fee.toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationPublicKey,
        asset: StellarSdk.Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  const { signedTxXdr, error } = await signTransaction(transaction.toXDR(), {
    address: sourcePublicKey,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  if (error) {
    throw new Error(error);
  }

  if (!signedTxXdr) {
    throw new Error("Freighter did not return a signed transaction.");
  }

  const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    NETWORK_PASSPHRASE
  );

  return server.submitTransaction(signedTransaction);
}
