import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { UserBill } from "@core/graphql/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuditUserBills } from "@utils/hooks/mutations";

interface UserBillBatchAuditModalProps {
  open: boolean;
  onClose: () => void;
  month: string;
  bills: UserBill[];
  onSuccess: () => void;
}

export const UserBillBatchAuditModal = ({
  open,
  onClose,
  month,
  bills,
  onSuccess,
}: UserBillBatchAuditModalProps) => {
  const [auditBills, { loading }] = useAuditUserBills();
  const [error, setError] = useState<string | null>(null);

  const count = bills.length;

  const handleConfirm = async () => {
    try {
      setError(null);
      const { data } = await auditBills({
        variables: { ids: bills.map((b) => b.id) },
      });

      const updatedCount = data?.auditUserBills?.updatedCount ?? 0;

      if (updatedCount > 0) {
        toast.success(`已審核 ${updatedCount} 筆電費單`);
      }

      if (updatedCount < count) {
        toast.warning(
          `部分電費單已被其他人審核，僅成功審核 ${updatedCount} 筆`
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError("批次審核過程發生錯誤");
      console.error("Batch audit error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleOutlineIcon color="primary" />
          <Typography variant="h6">批次審核 - 用戶電費單 {month}</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} disabled={loading} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box
          sx={{
            backgroundColor: "grey.50",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 3,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            將審核 {count} 筆電費單
          </Typography>
          <Typography variant="body2" color="text.secondary">
            狀態將變更為「已審核」
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
            待審核電費單清單
          </Typography>
          <List dense sx={{ py: 0 }}>
            {bills.map((bill, index) => (
              <Box key={bill.id}>
                <ListItem sx={{ px: 1, py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {bill.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Chip
                          label="待審核"
                          color="warning"
                          size="small"
                          sx={{ height: 20, fontSize: "0.75rem" }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < bills.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          取消
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || count === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleOutlineIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? "審核中..." : "確認審核"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
