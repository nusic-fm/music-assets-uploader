import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "NUSIC Access Pass",
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID)],
});

export const WalletConnect = new WalletConnectConnector({
  rpc: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID)],
});

export const Injected = new InjectedConnector({
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID)],
});
