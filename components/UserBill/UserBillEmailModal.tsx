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
import { ElectricBillStatus, UserBill } from "@core/graphql/types";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useTaskProgress, TaskStatus, TaskType } from "@core/context/task-progress";

const SEND_USER_BILLS_EMAIL = gql`
  mutation SendUserBillsEmail($month: String!) {
    sendUserBillsEmail(month: $month) {
      success
      message
      batchId
      totalJobs
    }
  }
`;

interface StatusCounts {
  approvedCount: number;
  pendingCount: number;
  draftCount: number;
  rejectedCount: number;
}

interface UserBillEmailModalProps {
  open: boolean;
  onClose: () => void;
  month: string;
  bills: UserBill[];
  statusCounts?: StatusCounts;
}

export const UserBillEmailModal = ({
  open,
  onClose,
  month,
  bills,
  statusCounts,
}: UserBillEmailModalProps) => {
  const [sendEmail, { loading }] = useMutation(SEND_USER_BILLS_EMAIL);
  const [error, setError] = useState<string | null>(null);
  const { addTask, selectTask } = useTaskProgress();

  // 從後端取得的已審核數量（優先使用），或從 bills 計算（fallback）
  const approvedCount = statusCounts?.approvedCount ?? bills.filter(
    (bill) => bill.status === ElectricBillStatus.Approved
  ).length;
  const unapprovedCount = statusCounts
    ? (statusCounts.pendingCount + statusCounts.draftCount + statusCounts.rejectedCount)
    : bills.filter((bill) => bill.status !== ElectricBillStatus.Approved).length;

  // 從當前頁面的 bills 中篩選已審核帳單用於顯示預覽
  const approvedBills = bills.filter(
    (bill) => bill.status === ElectricBillStatus.Approved
  );
  const unapprovedBills = bills.filter(
    (bill) => bill.status !== ElectricBillStatus.Approved
  );
  const hasApprovedBills = approvedCount > 0;

  // 計算郵件數量（按用戶分組）
  const userGroups = new Map<string, UserBill[]>();
  approvedBills.forEach((bill) => {
    const userId = bill.userBillConfig?.id || "unknown";
    if (!userGroups.has(userId)) {
      userGroups.set(userId, []);
    }
    userGroups.get(userId)!.push(bill);
  });
  const emailCount = userGroups.size;

  const handleSendEmail = async () => {
    try {
      setError(null);
      const { data } = await sendEmail({
        variables: { month },
      });

      if (data?.sendUserBillsEmail?.success) {
        // 添加任務到進度追蹤
        const { batchId, totalJobs } = data.sendUserBillsEmail;
        if (batchId) {
          const now = new Date().toISOString();
          addTask({
            batchId,
            type: TaskType.USER_BILL_EMAIL,
            title: `${month} 用戶帳單郵件`,
            totalJobs: totalJobs || approvedCount,
            completedJobs: 0,
            failedJobs: 0,
            status: TaskStatus.PENDING,
            createdAt: now,
            updatedAt: now,
          });
          // 選中此任務以顯示詳情
          selectTask(batchId);
        }
        onClose();
      } else {
        setError(data?.sendUserBillsEmail?.message || "寄信失敗");
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
      default:
        return { label: status, color: "default" as const };
    }
  };

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
          <Typography variant="h6">用戶電費單  {month}</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {!hasApprovedBills ? (
          // 情境：沒有已審核的帳單
          <Box>
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<WarningIcon />}
            >
              <Typography variant="body2" fontWeight="500">
                該月份無已審核的電費單可寄送
              </Typography>
              <Typography variant="caption" color="text.secondary">
                共 {unapprovedCount} 筆電費單尚未審核
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
                {unapprovedBills.slice(0, 10).map((bill, index) => {
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
                              href={`/electric-bill/user-bill?month=${month}&userBillId=${bill.id}`}
                              underline="hover"
                              sx={{
                                fontWeight: 500,
                                color: "primary.main",
                                cursor: "pointer"
                              }}
                            >
                              {bill.name || "未知電費單"}
                            </Link>
                          }
                          secondary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
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
                      {index < Math.min(unapprovedBills.length, 10) - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </Box>
                  );
                })}
                {unapprovedBills.length > 10 && (
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 2, display: "block", mt: 1 }}>
                    ...及其他 {unapprovedBills.length - 10} 筆
                  </Typography>
                )}
              </List>
            </Box>
          </Box>
        ) : (
          // 情境：有已審核的帳單可寄送
          <Box>
            {unapprovedCount > 0 ? (
              // 有部分未審核
              <Alert
                severity="warning"
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<WarningIcon />}
              >
                <Typography variant="body2" fontWeight="500">
                  部分電費單尚未審核
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  將寄送 {approvedCount} 筆已審核電費單（另有 {unapprovedCount} 筆未審核，不會寄送）
                </Typography>
              </Alert>
            ) : (
              // 全部已審核
              <Alert
                severity="success"
                sx={{ mb: 3, borderRadius: 2 }}
                icon={<CheckCircleIcon />}
              >
                <Typography variant="body2" fontWeight="500">
                  所有電費單皆已審核完成
                </Typography>
              </Alert>
            )}

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
                {month} 月份將發送 {emailCount} 封郵件，共 {approvedCount} 筆電費單
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", lineHeight: 1.8 }}>
                系統會將同一用戶的電費單合併成一封郵件寄送給該用戶的承辦人員，
                每封郵件包含該用戶當月所有電費單的 PDF 附件。
              </Typography>
            </Box>

            {approvedBills.length > 0 && (
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
                  {approvedBills.slice(0, 5).map((bill) => (
                    <ListItem key={bill.id} sx={{ px: 1, py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Link
                            href={`/electric-bill/user-bill?month=${month}&userBillId=${bill.id}`}
                            underline="hover"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {bill.name || "未知電費單"}
                          </Link>
                        }
                      />
                    </ListItem>
                  ))}
                  {approvedCount > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      ...及其他 {approvedCount - 5} 筆
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
          {hasApprovedBills ? "取消" : "關閉"}
        </Button>
        {hasApprovedBills && (
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
