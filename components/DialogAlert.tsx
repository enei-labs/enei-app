import { Box, Button, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@components/Dialog";

interface DialogAlertProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: VoidFunction;
  onClose: VoidFunction;
}

function DialogAlert(props: DialogAlertProps) {
  const { open, title, content, onConfirm, onClose } = props;

  return (
    <Dialog maxWidth="xs" key="confirm" open={open} onClose={onClose}>
      <Typography variant="h4">{title}</Typography>

      <Typography variant="body1">{content}</Typography>

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
          onClick={onConfirm}
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

export default DialogAlert;
