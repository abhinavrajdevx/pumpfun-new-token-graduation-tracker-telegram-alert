import solanaWeb3 from "@solana/web3.js";

const _getLatestMigratedTokens = async (
  address: solanaWeb3.PublicKeyData,
  numTx: number,
  solanaConnection: solanaWeb3.Connection
) => {
  console.log("request sent");
  try {
    const pubKey = new solanaWeb3.PublicKey(address);
    let transactionList = await solanaConnection.getSignaturesForAddress(
      pubKey,
      {
        limit: numTx,
      }
    );

    const migrated_tokens_pumpfun_new: string[] = [];
    for (let i = 0; i < transactionList.length; i++) {
      const transaction: any = transactionList[i];
      const tx: any = await solanaConnection.getTransaction(
        transaction.signature,
        {
          maxSupportedTransactionVersion: 0,
        }
      );
      let log = "";
      let status = false;
      tx.meta.logMessages.map((_log: string) => {
        log = log + _log;
      });
      status = log.search("initialize2") != -1 ? true : false;
      if (status) {
        let staticAccountKeys_arr =
          tx.transaction.message.staticAccountKeys[18];
        let x = String(staticAccountKeys_arr).split(" ");
        status = false;
        const token_address = x[0];
        status = token_address.endsWith("pump");
        if (status) {
          migrated_tokens_pumpfun_new.push(token_address);
        }
      }
    }
    return migrated_tokens_pumpfun_new;
  } catch (e) {
    console.log(e);
  }
};

const getLatestMigratedTokens = async (
  solana_router: solanaWeb3.PublicKeyData,
  solanaConnection: solanaWeb3.Connection
) => {
  const tokens_migrated_pumpfun = await _getLatestMigratedTokens(
    solana_router,
    20,
    solanaConnection
  );
  return tokens_migrated_pumpfun;
};

export { getLatestMigratedTokens };
