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
import EmailIcon from "@mui/icons-material/Email";
import { ElectricBillStatus, IndustryBillForEmail, BillSource } from "@core/graphql/types";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useTaskProgress, TaskStatus, TaskType } from "@core/context/task-progress";
import { useIndustryBillsForEmail } from "@utils/hooks/queries";

const SEND_INDUSTRY_BILLS_EMAIL = gql`
  mutation SendIndustryBillsEmail($month: String!, $industryBillIds: [String!]) {
    sendIndustryBillsEmail(month: $month, industryBillIds: $industryBillIds) {
      success
      message
      batchId
      totalJobs
    }
  }
`;

interface IndustryBillEmailModalProps {
  open: boolean;
  onClose: () => void;
  month: string;
}

export const IndustryBillEmailModal = ({
  open,
  onClose,
  month,
}: IndustryBillEmailModalProps) => {
  const { data, loading: billsLoading } = useIndustryBillsForEmail(month, { skip: !open });
  const bills = data?.industryBillsForEmail || [];

  const [sendEmail, { loading: sendLoading }] = useMutation(SEND_INDUSTRY_BILLS_EMAIL);
  const [error, setError] = useState<string | null>(null);
  const { addTask, selectTask } = useTaskProgress();

  const loading = billsLoading || sendLoading;

  // 符合條件的電費單：已審核 OR (手動匯入 且 有原始檔案)
  const eligibleBills = bills.filter(
    (bill) =>
      bill.status === ElectricBillStatus.Approved ||
      (bill.billSource === BillSource.ManualImport && bill.hasOriginalFile)
  );
  const ineligibleBills = bills.filter(
    (bill) =>
      bill.status !== ElectricBillStatus.Approved &&
      !(bill.billSource === BillSource.ManualImport && bill.hasOriginalFile)
  );

  const eligibleCount = eligibleBills.length;
  const ineligibleCount = ineligibleBills.length;
  const hasEligibleBills = eligibleCount > 0;

  // 計算郵件數量（按發電業分組）
  const industryGroups = new Map<string, IndustryBillForEmail[]>();
  eligibleBills.forEach((bill) => {
    const industryId = bill.industry?.id || "unknown";
    if (!industryGroups.has(industryId)) {
      industryGroups.set(industryId, []);
    }
    industryGroups.get(industryId)!.push(bill);
  });
  const emailCount = industryGroups.size;

  const handleSendEmail = async () => {
    try {
      setError(null);
      const { data } = await sendEmail({
        variables: {
          month,
          industryBillIds: eligibleBills.map((bill) => bill.id),
        },
      });

      if (data?.sendIndustryBillsEmail?.success) {
        // 添加任務到進度追蹤
        const { batchId, totalJobs } = data.sendIndustryBillsEmail;
        if (batchId) {
          const now = new Date().toISOString();
          addTask({
            batchId,
            type: TaskType.INDUSTRY_BILL_EMAIL,
            title: `${month} 產業帳單郵件`,
            totalJobs: totalJobs || eligibleCount,
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
          <Typography variant="h6">發電業電費單  {month}</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {!hasEligibleBills ? (
          // 情境：沒有符合條件的帳單
          <Box>
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<WarningIcon />}
            >
              <Typography variant="body2" fontWeight="500">
                無符合條件的電費單可寄送
              </Typography>
              <Typography variant="caption" color="text.secondary">
                共 {ineligibleCount} 筆電費單不符合寄送條件
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
                {ineligibleBills.slice(0, 10).map((bill, index) => {
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
                      {index < Math.min(ineligibleBills.length, 10) - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </Box>
                  );
                })}
                {ineligibleBills.length > 10 && (
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 2, display: "block", mt: 1 }}>
                    ...及其他 {ineligibleBills.length - 10} 筆
                  </Typography>
                )}
              </List>
            </Box>
          </Box>
        ) : (
          // 情境：有符合條件的帳單可寄送
          <Box>
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
                將發送 {emailCount} 封郵件，共 {eligibleCount} 筆電費單
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", lineHeight: 1.8 }}>
                系統會將同一發電業的電費單合併成一封郵件寄送給該發電業的承辦人員，
                每封郵件包含該發電業當月所有電廠的購電通知單 PDF 附件。
              </Typography>
            </Box>

            {eligibleBills.length > 0 && (
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
                  {eligibleBills.slice(0, 5).map((bill) => (
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
                  {eligibleCount > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      ...及其他 {eligibleCount - 5} 筆
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
          {hasEligibleBills ? "取消" : "關閉"}
        </Button>
        {hasEligibleBills && (
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