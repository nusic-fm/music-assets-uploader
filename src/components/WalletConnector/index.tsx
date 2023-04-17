import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
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
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        Connect Wallet
        <DialogContentText sx={{ mt: 1 }} variant="caption">
          If you don't have a wallet, you can mint using your credit card
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Stack mt={2} gap={2}>
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
            onClick={() => {
              let provider;
              if ((window as any).ethereum.providers?.length) {
                (window as any).ethereum.providers.forEach(async (p: any) => {
                  if (p.isMetaMask) provider = p;
                });
              }
              if (provider) {
                (window as any).ethereum.setSelectedProvider(provider);
              }
              onSignInUsingWallet(Injected);
            }}
            startIcon={
              <img src="/signin/mm.png" alt="" width={24} height={24} />
            }
          >
            Metamask
          </Button>
          {/* <Typography align="center" fontWeight={700}>
            Or
          </Typography> */}
          {/* <Button
            startIcon={<CreditCardIcon />}
            component="label"
            sx={{ color: "white" }}
          >
            <CrossmintPayButton
              style={{ display: "none" }}
              clientId="0c4a330a-7286-4e0d-9d79-43ab7a03db65"
              mintConfig={{
                type: "erc-721",
                totalPrice: "0.25",
                tokenQuantity: 1,
              }}
              // environment="staging"
              // mintTo={account ?? undefined}
            />
            Mint with CARD
          </Button> */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectors;
