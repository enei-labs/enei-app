import { Box, Button, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@components/Dialog";

interface EditConfirmDialogProps {
  onCloseAllDialog: VoidFunction;
  open: boolean;
  onClose: VoidFunction;
  variant: "edit" | "create";
}

const getContent = (variant: EditConfirmDialogProps["variant"]) => {
  let title: string = "";
  let content: string = "";

  if (variant === "edit") {
    title = "關閉修改頁面";
    content = `您的資料尚未更新，關閉後資料將不會儲存，是否確認關閉修改頁面？`;
  }

  if (variant === "create") {
    title = "關閉新增頁面";
    content = `您的資料尚未新增，關閉後資料將不會儲存，是否確認關閉新增頁面？`;
  }

  return { title, content };
};

function EditConfirmDialog(props: EditConfirmDialogProps) {
  const { open, onClose, variant, onCloseAllDialog } = props;
  const { title, content } = getContent(variant);

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
          onClick={onCloseAllDialog}
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

export default EditConfirmDialog;
