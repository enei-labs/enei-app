import { PrintWrapper } from "@components/ReadExcelInput";
import { IndustryBill, ElectricBillStatus } from "@core/graphql/types";
import { ReviewStatusLookup } from "@core/look-up/review-status";
import {
  Box,
  Dialog,
  Typography,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useIndustryBill } from "@utils/hooks/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useAuditIndustryBill } from "@utils/hooks/mutations";
import { useSendIndustryBillEmail } from "@utils/hooks/mutations/useSendIndustryBillEmail";
import { toast } from "react-toastify";
import { CompanyBillTemplateData } from "@components/ElectricBill/CompanyBillTemplate";
import { DialogErrorBoundary } from "@components/ErrorBoundary";
import EmailIcon from "@mui/icons-material/Email";

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  onClose: () => void;
  industryBill: IndustryBill;
}

// 日期格式化
const formatBillingInfo = (billingDate: string) => {
  const date = new Date(billingDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  const lastDay = new Date(year, month, 0).getDate();
  
  return {
    billingMonth: `${year}年${month + 1}月`,
    billingDateRange: `${year}/${month}/1 - ${year}/${month}/${lastDay}`,
  };
};

export const IndustryBillDialog = ({
  industryBill,
  isOpenDialog,
  onClose,
}: IndustryBillDialogProps) => {
  const { data, loading, error } = useIndustryBill(industryBill.id);
  const [auditIndustryBill, { loading: auditIndustryBillLoading }] =
    useAuditIndustryBill();
  const [sendIndustryBillEmail, { loading: sendingEmail }] = useSendIndustryBillEmail();
  const [reviewStatus, setReviewStatus] = useState<ElectricBillStatus | null>(
    null
  );

  useEffect(() => {
    if (data?.industryBill.status === ElectricBillStatus.Approved) {
      setReviewStatus(ElectricBillStatus.Approved);
    }

    if (data?.industryBill.status === ElectricBillStatus.Manual) {
      setReviewStatus(ElectricBillStatus.Manual);
    }

    if (data?.industryBill.status === ElectricBillStatus.Pending) {
      setReviewStatus(ElectricBillStatus.Pending);
    }

    if (data?.industryBill.status === ElectricBillStatus.Rejected) {
      setReviewStatus(ElectricBillStatus.Rejected);
    }
  }, [data]);
  

  const industryBillTemplateData: CompanyBillTemplateData | null =
    useMemo(() => {
      if (!data || loading) return null;
      if (error) return null;

      const { billingMonth, billingDateRange } = formatBillingInfo(data.industryBill.billingDate);
      const amount = Math.round(data.industryBill.price * data.industryBill.transferDegree);
      const tax = Math.round(amount * 0.05);
      const totalIncludeTax = amount + tax;

      return {
        billingMonth: billingMonth,
        billingDate: billingDateRange,
        companyName: data.industryBill.industryBillConfig?.industry?.name ?? "",
        // 負責人名稱
        responsibleName:
          data.industryBill.industryBillConfig?.industry?.contactName ?? "",
        // 轉供單編號
        transferNumber: data.industryBill.transferDocumentNumber,
        // 電號
        serialNumber: data.industryBill.powerPlantNumber,
        // 電廠名稱
        powerPlantName: data.industryBill.powerPlantName,
        // 契約編號
        contractNumber: data.industryBill.companyContractNumber ?? "",
        // 基本資訊
        basicInfo: {
          // 併聯容量
          totalCapacity: data.industryBill.supplyVolume,
          // 轉供容量
          transferCapacity: data.industryBill.supplyVolume,
        },
        // 城市
        city: "",
        // 廠址
        address: data.industryBill.powerPlantAddress,
        // 電費計算
        billing: {
          // 轉供度數
          transferKwh: data.industryBill.transferDegree,
          // 費率
          price: data.industryBill.price,
          // 電費（未稅）
          amount: amount,
          // 營業稅 
          tax: tax,
          // 總金額
          totalIncludeTax: totalIncludeTax,
        },
      };
    }, [data, loading, error]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: data?.industryBill.name,
  });

  const handleReviewChange = async (
    event: React.MouseEvent<HTMLElement>,
    newStatus: ElectricBillStatus | null
  ) => {
    if (!newStatus) return;
    const variables = { id: industryBill.id, status: newStatus };

    await auditIndustryBill({ variables });
    setReviewStatus(newStatus);
    switch (newStatus) {
      case ElectricBillStatus.Approved:
        toast.success(`已調整審核狀態: ${ReviewStatusLookup[newStatus]}`);
        break;
      case ElectricBillStatus.Manual:
        toast.success(`已調整審核狀態: ${ReviewStatusLookup[newStatus]}`);
        break;
    }
  };

  const handleManualImport = () => {
    // TODO: 實作手動匯入邏輯
    onClose();
  };

  const handleSendEmail = async () => {
    try {
      const { data: sendData } = await sendIndustryBillEmail({
        variables: { industryBillId: industryBill.id },
      });

      if (sendData?.sendIndustryBillEmail?.success) {
        toast.success(sendData.sendIndustryBillEmail.message || "電費單已成功寄出");
      } else {
        toast.error(sendData?.sendIndustryBillEmail?.message || "寄送失敗");
      }
    } catch (err) {
      console.error("Send email error:", err);
      toast.error("寄送電費單時發生錯誤");
    }
  };

  return (
    <Dialog open={isOpenDialog} onClose={onClose} maxWidth="md">
      <DialogErrorBoundary onClose={onClose}>
        <Box padding="36px">
          <Typography textAlign={"left"} variant="h4">
            發電業電費單
          </Typography>
          <Typography textAlign={"left"} variant="h6">
            電費單組合： {industryBill.industryBillConfig?.name ?? ""}
          </Typography>
          {!industryBillTemplateData ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <PrintWrapper
              ref={componentRef}
              userBillTemplatesData={[]}
              companyBillTemplatesData={[industryBillTemplateData]}
            />
          )}

          {reviewStatus && (
            <Box sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center" }}>
              <Typography>當前審核狀態：</Typography>
              {auditIndustryBillLoading ? (
                <CircularProgress size="16px" />
              ) : (
                <Typography>{ReviewStatusLookup[reviewStatus]}</Typography>
              )}
            </Box>
          )}

          <Box sx={{ mt: 3, mb: 2 }}>
            <ToggleButtonGroup
              value={reviewStatus}
              exclusive
              onChange={handleReviewChange}
              aria-label="審核狀態"
              fullWidth
            >
              <ToggleButton
                value={ElectricBillStatus.Approved}
                aria-label="審核通過"
              >
                審核通過
              </ToggleButton>
              <ToggleButton
                value={ElectricBillStatus.Manual}
                aria-label="選擇手動輸入"
              >
                選擇手動輸入
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            {reviewStatus === ElectricBillStatus.Approved && (
              <>
                <Button variant="contained" color="primary" onClick={handlePrint}>
                  列印
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  startIcon={sendingEmail ? <CircularProgress size={20} /> : <EmailIcon />}
                >
                  {sendingEmail ? "寄送中..." : "寄送電費單"}
                </Button>
              </>
            )}

            {reviewStatus === ElectricBillStatus.Manual && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleManualImport}
              >
                手動輸入
              </Button>
            )}
          </Box>
        </Box>
      </DialogErrorBoundary>
    </Dialog>
  );
};
