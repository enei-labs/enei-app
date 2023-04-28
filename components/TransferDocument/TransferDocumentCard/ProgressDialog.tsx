import { Box, Button, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@components/Dialog";
import { InputDate, InputText } from "@components/Input";

interface ProgressDialogProps {
  handleNextFn: VoidFunction;
  open: boolean;
  onClose: VoidFunction;
  showContractInput: boolean;
}

function ProgressDialog(props: ProgressDialogProps) {
  const { open, onClose, showContractInput, handleNextFn } = props;

  return (
    <Dialog maxWidth="xs" key="confirm" open={open} onClose={onClose}>
      <Typography variant="h4">填入進展日期</Typography>

      <InputDate label="進展日期" />

      {showContractInput ? <InputText label="契約編號" /> : null}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <Button
          startIcon={<CheckCircleOutlineIcon />}
          variant="contained"
          onClick={() => {
            handleNextFn();
            onClose();
          }}
        >
          確認
        </Button>
        <Button startIcon={<CloseIcon />} variant="outlined" onClick={onClose}>
          取消
        </Button>
      </Box>
    </Dialog>
  );
}

export default ProgressDialog;
