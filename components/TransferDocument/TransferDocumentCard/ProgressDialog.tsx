import { Box, Button, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@components/Dialog";
import { InputDate, InputText } from "@components/Input";
import { useForwardTransferDocumentStage } from "@utils/hooks";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

interface ProgressDialogProps {
  handleNextFn: VoidFunction;
  open: boolean;
  onClose: VoidFunction;
  showContractInput: boolean;
  transferDocumentId: string;
}

function ProgressDialog(props: ProgressDialogProps) {
  const { open, onClose, showContractInput, handleNextFn, transferDocumentId } =
    props;
  const [updateStage, loading] =
    useForwardTransferDocumentStage(transferDocumentId);
  const [date, setDate] = useState(new Date().toString());
  const [number, setNumber] = useState<string>("");

  return (
    <Dialog maxWidth="xs" key="confirm" open={open} onClose={onClose}>
      <Typography variant="h4">填入進展日期</Typography>

      <InputDate value={date} onChange={setDate} label="進展日期" />

      {showContractInput ? (
        <InputText
          value={number}
          onChange={setNumber as any}
          label="契約編號"
        />
      ) : null}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <LoadingButton
          loading={loading}
          startIcon={<CheckCircleOutlineIcon />}
          variant="contained"
          onClick={async () => {
            await updateStage(new Date(date), number);
            handleNextFn();
            onClose();
          }}
        >
          確認
        </LoadingButton>
        <Button startIcon={<CloseIcon />} variant="outlined" onClick={onClose}>
          取消
        </Button>
      </Box>
    </Dialog>
  );
}

export default ProgressDialog;
