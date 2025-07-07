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
import { toast } from "react-toastify";
import { CompanyBillTemplateData } from "@components/ElectricBill/CompanyBillTemplate";
import { DialogErrorBoundary } from "@components/ErrorBoundary";

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  onClose: () => void;
  industryBill: IndustryBill;
}

export const IndustryBillDialog = ({
  industryBill,
  isOpenDialog,
  onClose,
}: IndustryBillDialogProps) => {
  const { data, loading, error } = useIndustryBill(industryBill.id);
  const [auditIndustryBill, { loading: auditIndustryBillLoading }] =
    useAuditIndustryBill();
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

      console.log({ data });

      const billingDate = new Date(data.industryBill.billingDate);
      const year = billingDate.getFullYear();
      const month = billingDate.getMonth();
      
      // 計費年月：原始日期 + 1個月的第一天
      const nextMonthDate = new Date(year, month, 1);
      
      // 計費期間：原始月份的完整範圍 (當月1號到當月最後一天)
      const startOfCurrentMonth = new Date(year, month - 1 , 1);
      const endOfCurrentMonth = new Date(year, month, 0);
      
      const formatters = {
        month: new Intl.DateTimeFormat('zh-TW', {
          year: 'numeric',
          month: '2-digit'
        }),
        date: new Intl.DateTimeFormat('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      };

      return {
        // 計費年月： 「新增台電代輸繳費單」「計費年月」+1個月
        billingMonth: formatters.month.format(nextMonthDate).replace('/', '年') + '月',
        // 計費期間： 「新增台電代輸繳費單」「計費年月」的起訖日
        billingDate: `${formatters.date.format(startOfCurrentMonth)} - ${formatters.date.format(endOfCurrentMonth)}`,
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
          amount: data.industryBill.price * data.industryBill.transferDegree,
          // 營業稅
          tax:
            data.industryBill.price * data.industryBill.transferDegree * 0.05,
          // 總金額
          totalIncludeTax:
            data.industryBill.price * data.industryBill.transferDegree +
            data.industryBill.price * data.industryBill.transferDegree * 0.05,
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
              <Button variant="contained" color="primary" onClick={handlePrint}>
                列印
              </Button>
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
