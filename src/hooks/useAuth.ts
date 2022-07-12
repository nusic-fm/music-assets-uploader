import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
// import { injectedConnector } from "../utils/connectors";
import { InjectedConnector } from "@web3-react/injected-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    // 1, // Mainet
    // 3, // Ropsten
    // 4, // Rinkeby
    // 5, // Goerli
    // 42, // Kovan
    // 137, // Polygon
    // parseInt(process.env.REACT_APP_MATIC_CHAIN_ID as string),
    1287, //Moonbase albha
    // 1285, //Moonriver
  ],
});
const useAuth = () => {
  const { activate } = useWeb3React();

  const login = useCallback(() => {
    activate(injectedConnector, async (error: Error) => {
      console.error(error);
      if (error.name === "UnsupportedChainIdError") {
        console.log(
          "error",
          "Unsupported chain, Please connect MoonbaseAlpha Network to continue."
        );
        alert(
          "Unsupported chain, Please connect MoonriverAlpha Network to continue."
        );
      } else {
        console.log("error", error.name || error.message);
      }
    });
  }, [activate]);

  return { login };
};

export default useAuth;
