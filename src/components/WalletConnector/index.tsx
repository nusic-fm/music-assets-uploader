import { Dialog, DialogContent, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import {
  CoinbaseWallet,
  WalletConnect,
  Injected,
} from "../../hooks/useWalletConnectors";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

type Props = {
  open: boolean;
  onSignInUsingWallet: (
    connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  ) => Promise<void>;
  onClose: () => void;
};

const WalletConnectors = ({ open, onSignInUsingWallet, onClose }: Props) => {
  const { error } = useWeb3React();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Stack gap={2}>
          {error?.message && (
            <Typography color={"error"}>
              An Error Occurred: {error.message}
            </Typography>
          )}
          <Button
            color="secondary"
            onClick={() => onSignInUsingWallet(CoinbaseWallet)}
            startIcon={
              <img
                src="/signin/cbw.png"
                alt=""
                width={24}
                height={24}
                style={{ borderRadius: "4px" }}
              />
            }
          >
            Coinbase Wallet
          </Button>
          <Button
            color="secondary"
            onClick={() => onSignInUsingWallet(WalletConnect)}
            startIcon={
              <img src="/signin/wc.png" alt="" width={24} height={24} />
            }
          >
            Wallet Connect
          </Button>
          <Button
            color="secondary"
            onClick={() => onSignInUsingWallet(Injected)}
            startIcon={
              <img src="/signin/mm.png" alt="" width={24} height={24} />
            }
          >
            Metamask
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectors;
