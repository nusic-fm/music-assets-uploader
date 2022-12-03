import { Snackbar } from "@mui/material";

type Props = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  action?: any;
};

const AlertSnackBar = ({ isOpen, message, action, onClose }: Props) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={10000}
      onClose={onClose}
      message={message}
      action={action}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );
};

export default AlertSnackBar;
