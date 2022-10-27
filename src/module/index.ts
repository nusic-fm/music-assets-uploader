// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.

import { StdFee } from "@cosmjs/launchpad";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { Registry, OfflineSigner, EncodeObject } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgCreateSection } from "./types/metadatalayercosmos/tx";
import { MsgCreateStem } from "./types/metadatalayercosmos/tx";
import { MsgCreateFullTrack } from "./types/metadatalayercosmos/tx";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { cosmosChainId, getCheckersChainInfo, rpc } from "../App";

declare global {
  interface Window extends KeplrWindow {}
}
const types = [
  [
    "/metadatalayercosmos.metadatalayercosmos.MsgCreateSection",
    MsgCreateSection,
  ],
  ["/metadatalayercosmos.metadatalayercosmos.MsgCreateStem", MsgCreateStem],
  [
    "/metadatalayercosmos.metadatalayercosmos.MsgCreateFullTrack",
    MsgCreateFullTrack,
  ],
];
export const MissingWalletError = new Error("wallet is required");

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const registry = new Registry(<any>types);

const defaultFee = {
  amount: [],
  gas: "200000",
};

interface TxClientOptions {
  addr: string;
}

interface SignAndBroadcastOptions {
  fee: StdFee;
  memo?: string;
}

const txClient = async (
  wallet: OfflineSigner,
  // { addr }: TxClientOptions = { addr: "http://localhost:26657" }
  { addr }: TxClientOptions = {
    addr: rpc,
  }
) => {
  if (!wallet) throw MissingWalletError;
  let client: SigningStargateClient;
  if (addr) {
    client = await SigningStargateClient.connectWithSigner(addr, wallet, {
      registry,
    });
  } else {
    client = await SigningStargateClient.offline(wallet, { registry });
  }
  const { address } = (await wallet.getAccounts())[0];

  return {
    signAndBroadcast: (
      msgs: EncodeObject[],
      { fee, memo }: SignAndBroadcastOptions = { fee: defaultFee, memo: "" }
    ) => client.signAndBroadcast(address, msgs, fee, memo),
    msgCreateSection: (data: MsgCreateSection): EncodeObject => ({
      typeUrl: "/metadatalayercosmos.metadatalayercosmos.MsgCreateSection",
      value: MsgCreateSection.fromPartial(data),
    }),
    msgCreateStem: (data: MsgCreateStem): EncodeObject => ({
      typeUrl: "/metadatalayercosmos.metadatalayercosmos.MsgCreateStem",
      value: MsgCreateStem.fromPartial(data),
    }),
    msgCreateFullTrack: (data: MsgCreateFullTrack): EncodeObject => ({
      typeUrl: "/metadatalayercosmos.metadatalayercosmos.MsgCreateFullTrack",
      value: MsgCreateFullTrack.fromPartial(data),
    }),
  };
};

const getSigningStargateClient = async (): Promise<{
  creator: string;
  signingClient: SigningStargateClient;
}> => {
  const { keplr } = window;
  if (!keplr) {
    alert("You need to install Keplr");
    throw new Error("You need to install Keplr");
  }
  await keplr.experimentalSuggestChain(getCheckersChainInfo());
  await keplr.enable(cosmosChainId);
  const offlineSigner: OfflineSigner = keplr.getOfflineSigner(cosmosChainId);
  const creator = (await offlineSigner.getAccounts())[0].address;
  console.log("Creator: ", creator);
  const client: SigningStargateClient =
    await SigningStargateClient.connectWithSigner(
      // "http://localhost:26657",
      rpc,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString("1nusic"),
        registry,
        prefix: "nusic",
      }
    );
  return { creator: creator, signingClient: client };
};

interface QueryClientOptions {
  addr: string;
}

const queryClient = async (
  // { addr }: QueryClientOptions = { addr: "http://localhost:1317" }
  { addr }: QueryClientOptions = {
    addr: "https://1317-ignite-gitpod-hcddiem770k.ws-us72.gitpod.io/",
  }
) => {
  return new Api({ baseUrl: addr });
};

export { txClient, queryClient, getSigningStargateClient };
