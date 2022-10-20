/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import WebFont from "webfontloader";
// import { MarketPlace } from "./MarketPlace";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import NonVisualizer from "./NonVisualizer";
import { MarketPlace } from "./MarketPlace";

WebFont.load({
  google: {
    families: ["Playfair Display"],
  },
});

// import getNodeUrl from "./getRpcUrl";
// import { InjectedConnector } from '@web3-react/injected-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const POLLING_INTERVAL = 12000;
// const rpcUrl = getNodeUrl();
// const chainId = parseInt(process.env.REACT_APP_MATIC_CHAIN_ID as string, 10);

// const injected = new InjectedConnector({ supportedChainIds: [chainId] });

// const walletconnect = new WalletConnectConnector({
//   rpc: { [chainId]: rpcUrl },
//   // bridge: "https://pancakeswap.bridge.walletconnect.org/",
//   qrcode: true,
//   pollingInterval: POLLING_INTERVAL,
// });

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

const themeSettings = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#573FC8",
      light: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    info: {
      main: "#998ABE",
      // main: "#A794FF",
    },
    background: { paper: "black" },
  },
  typography: {
    button: {
      fontFamily: '"Playfair Display" , sans-serif',
    },
    h5: {
      fontFamily: '"Playfair Display"',
    },
    allVariants: {
      color: "#ffffff",
    },
    fontFamily: `"Playfair Display" , sans-serif`,
  },
});
const theme = responsiveFontSizes(themeSettings);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <Routes>
            {/* <Route path="/" element={<MarketPlace />} />
            <Route path="/upload" element={<App />} />
            <Route path="/mackenzie" element={<NonVisualizer trackIdx={0} />} /> */}
            <Route path="/" element={<MarketPlace />} />
          </Routes>
        </Router>
      </Web3ReactProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
