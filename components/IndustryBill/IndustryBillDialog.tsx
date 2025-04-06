import { PrintWrapper } from "@components/ReadExcelInput";
import {
  UserBill,
  ElectricBillStatus,
  IndustryBill,
} from "@core/graphql/types";
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

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  onClose: () => void;
  industryBill: UserBill;
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

  const calculateTotalDegree = (
    electricNumberInfos: IndustryBill["electricNumberInfos"]
  ) => electricNumberInfos.reduce((acc, info) => acc + (info.degree ?? 0), 0);

  const calculateTotalAmount = (
    electricNumberInfos: IndustryBill["electricNumberInfos"]
  ) =>
    electricNumberInfos.reduce(
      (acc, info) => acc + (info.price ?? 0) * (info.degree ?? 0),
      0
    );

  const industryBillTemplateData: CompanyBillTemplateData | null =
    useMemo(() => {
      if (!data || loading) return null;
      if (error) return null;

      const totalDegree = calculateTotalDegree(
        data.industryBill.electricNumberInfos
      );
      const totalAmount = calculateTotalAmount(
        data.industryBill.electricNumberInfos
      );
      const tax = totalAmount * 0.05;

      return {
        // 計費年月： 「新增台電代輸繳費單」「計費年月」+1個月
        billingMonth: `${new Date(data.industryBill.billingDate).getFullYear()}年${
          new Date(data.industryBill.billingDate).getMonth() + 1 + 1
        }月`,
        // 計費期間： 「新增台電代輸繳費單」「計費年月」的起訖日
        billingDate: `${new Date(data.industryBill.billingDate).getFullYear()}/${
          new Date(data.industryBill.billingDate).getMonth() + 1
        }/1 - ${new Date(data.industryBill.billingDate).getFullYear()}/${
          new Date(data.industryBill.billingDate).getMonth() + 1
        }/${new Date(new Date(data.industryBill.billingDate).getFullYear(), new Date(data.industryBill.billingDate).getMonth() + 1, 0).getDate()}`,
        companyName: data.industryBill.industryBillConfig.industry.name,
        // 負責人名稱
        responsibleName:
          data.industryBill.industryBillConfig.industry.contactName,
        // 轉供單編號
        transferNumber: data.industryBill.transferDocumentNumbers.join(","),
        // 電號
        serialNumber: data.industryBill.electricNumberInfos
          .map((info) => info.number)
          .join(","),
        // 電廠名稱
        powerPlantName: data.industryBill.industryBillConfig.industry.name,
        // 契約編號
        contractNumber: "",
        // 基本資訊
        basicInfo: {
          // 併聯容量
          totalCapacity: 0,
          // 轉供容量
          transferCapacity: 0,
        },
        // 城市
        city: "",
        // 廠址
        address: "",
        // 電費計算
        billing: {
          // 轉供度數
          transferKwh: totalDegree,
          // 費率
          price: totalAmount,
          // 電費（未稅）
          amount: totalAmount,
          // 營業稅
          tax: tax,
          // 總金額
          totalIncludeTax: totalAmount + tax,
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
    console.log({ variables });
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
      <Box padding="36px">
        <Typography textAlign={"left"} variant="h4">
          用戶電費單
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
    </Dialog>
  );
};
