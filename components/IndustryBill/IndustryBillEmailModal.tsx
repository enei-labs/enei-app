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
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import { ElectricBillStatus, IndustryBill } from "@core/graphql/types";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const SEND_INDUSTRY_BILLS_EMAIL = gql`
  mutation SendIndustryBillsEmail($month: String!) {
    sendIndustryBillsEmail(month: $month) {
      success
      message
    }
  }
`;

interface IndustryBillEmailModalProps {
  open: boolean;
  onClose: () => void;
  month: string;
  bills: IndustryBill[];
}

export const IndustryBillEmailModal = ({
  open,
  onClose,
  month,
  bills,
}: IndustryBillEmailModalProps) => {
  const [sendEmail, { loading }] = useMutation(SEND_INDUSTRY_BILLS_EMAIL);
  const [error, setError] = useState<string | null>(null);

  // 檢查未審核的帳單
  const unapprovedBills = bills.filter(
    (bill) => bill.status !== ElectricBillStatus.Approved
  );
  const allApproved = unapprovedBills.length === 0;

  const handleSendEmail = async () => {
    try {
      setError(null);
      const { data } = await sendEmail({
        variables: { month },
      });

      if (data?.sendIndustryBillsEmail?.success) {
        onClose();
        // 可以加上成功通知
      } else {
        setError(data?.sendIndustryBillsEmail?.message || "寄信失敗");
      }
    } catch (err) {
      setError("寄信過程發生錯誤");
      console.error("Send email error:", err);
    }
  };

  const getStatusConfig = (status: ElectricBillStatus) => {
    switch (status) {
      case ElectricBillStatus.Draft:
        return { label: "未完成", color: "default" as const };
      case ElectricBillStatus.Pending:
        return { label: "待審核", color: "warning" as const };
      case ElectricBillStatus.Rejected:
        return { label: "已拒絕", color: "error" as const };
      case ElectricBillStatus.Approved:
        return { label: "已審核", color: "success" as const };
      case ElectricBillStatus.Manual:
        return { label: "已手動", color: "success" as const };
      default:
        return { label: status, color: "default" as const };
    }
  };

  console.log('bills', bills);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
        pb: 2
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon color="primary" />
          <Typography variant="h6">發電業電費單  {month}</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {!allApproved ? (
          <Box>
            <Alert
              severity="warning"
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<WarningIcon />}
            >
              <Typography variant="body2" fontWeight="500">
                尚有 {unapprovedBills.length} 筆電費單未審核完成
              </Typography>
              <Typography variant="caption" color="text.secondary">
                請先完成審核後再寄送電費單通知
              </Typography>
            </Alert>

            <Box sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              p: 2,
              border: "1px solid",
              borderColor: "divider"
            }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                待處理電費單清單
              </Typography>
              <List sx={{ py: 0 }}>
                {unapprovedBills.map((bill, index) => {
                  const statusConfig = getStatusConfig(bill.status);
                  return (
                    <Box key={bill.id}>
                      <ListItem
                        sx={{
                          px: 2,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: "action.hover",
                            borderRadius: 1
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Link
                              href={`/electric-bill/industry-bill?month=${month}&industryBillId=${bill.id}`}
                              underline="hover"
                              sx={{
                                fontWeight: 500,
                                color: "primary.main",
                                cursor: "pointer"
                              }}
                            >
                              {bill.powerPlantName  || "未知電廠"}
                            </Link>
                          }
                          secondary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              {bill.powerPlantNumber && (
                                <Typography variant="caption" color="text.secondary">
                                  電號：{bill.powerPlantNumber}
                                </Typography>
                              )}
                              <Chip
                                label={statusConfig.label}
                                color={statusConfig.color}
                                size="small"
                                sx={{ height: 20, fontSize: "0.75rem" }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < unapprovedBills.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </Box>
                  );
                })}
              </List>
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<CheckCircleIcon />}
            >
              <Typography variant="body2" fontWeight="500">
                所有電費單皆已審核完成
              </Typography>
            </Alert>

            <Box sx={{
              backgroundColor: "grey.50",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              mb: 3
            }}>
              <EmailIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                準備寄送電費單通知
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {month} 月份共 {bills.length} 筆電費單
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                電費單明細將以 Email 格式寄送給相關承辦人員
              </Typography>
            </Box>

            {bills.length > 0 && (
              <Box sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                maxHeight: 300,
                overflowY: "auto"
              }}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                  電費單清單預覽
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {bills.slice(0, 5).map((bill, index) => (
                    <ListItem key={bill.id} sx={{ px: 1, py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Link
                            href={`/electric-bill/industry-bill?month=${month}&industryBillId=${bill.id}`}
                            underline="hover"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {bill.powerPlantName || "未知電廠"}
                            {bill.powerPlantNumber && ` (${bill.powerPlantNumber})`}
                          </Link>
                        }
                      />
                    </ListItem>
                  ))}
                  {bills.length > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      ...及其他 {bills.length - 5} 筆
                    </Typography>
                  )}
                </List>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          {allApproved ? "取消" : "關閉"}
        </Button>
        {allApproved && (
          <Button
            onClick={handleSendEmail}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <EmailIcon />}
            sx={{ minWidth: 120 }}
          >
            {loading ? "寄送中..." : "確認寄信"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};