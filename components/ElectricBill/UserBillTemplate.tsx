export interface UsageData {
  // 電號
  serialNumber: string;
  // 轉供度數（度）
  kwh: number;
  // 每度電單價（元/kWh）
  price: number;
  // 電費（元）
  amount: number;
}

export interface UserBillTemplateData {
  // 計費年月
  billingMonth: string;
  // 計費期間
  billingDate: string;
  // 公司名稱
  companyName: string;
  // 客戶名稱
  customerName: string;
  // 客戶轉供單編號
  customerNumber: string;
  // 客戶地址
  address: string;
  // 應繳金額
  amount: number;
  // 繳費期限
  dueDate: string;
  // 客戶銀行資訊
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  // 度數合計
  totalKwh: number;
  // 電費合計
  totalAmount: number;
  // 轉供資料
  usage: UsageData[];
  // 代輸費
  substitutionFee: number;
  // 憑證審查費
  certificationFee: number;
  // 憑證服務費
  certificationServiceFee: number;
  // 規費合計
  totalFee: number;
  // 合計（未稅）
  total: number;
  // 營業稅
  tax: number;
  // 總計（含稅）
  totalIncludeTax: number;
}

import { Box, Grid, Typography } from "@mui/material";
import { forwardRef } from "react";
import Logo from "public/logo-with-name.svg";
import { formatNumber } from "@utils/format";

const styles = {
  container: {
    backgroundColor: "#FFF",
    padding: "32px 24px",
  },
  boxTitle: {
    fontSize: "16px",
    fontWeight: 700,
  },
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: "77px",
    marginTop: "10px",
    padding: "8px 16px",
  },
  itemTitle: {
    fontSize: "9px",
    fontWeight: 700,
  },
  table: {
    border: "1px solid #000",
    borderRadius: "4px",
    overflow: "hidden",
  },
  tableRow: {
    borderBottom: "1px solid #000",
    "&:last-child": {
      borderBottom: "none",
    },
  },
  tableHeader: {
    color: "#000",
    fontWeight: 700,
    fontSize: "12px",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  tableCell: {
    fontSize: "14px",
    padding: "8px",
    textAlign: "center",
    color: "#000",
  },
  tableSummary: {
    color: "#000",
    fontWeight: 700,
    fontSize: "12px",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
} as const;

interface UserBillProps {
  data: UserBillTemplateData;
}

const UserBillTemplate = forwardRef((props: UserBillProps, ref) => {
  const { data } = props;

  const formatValue = (value: number, isRateOrPrice: boolean = false) => {
    if (!value) return "";
    if (isRateOrPrice) {
      return value.toString();
    }
    return formatNumber(value);
  };

  return (
    <Box sx={styles.container} ref={ref}>
      <Box display="flex" justifyContent="space-between">
        <Logo height="40" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "4px",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#009688" }}>
            繳費通知單
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#009688" }}>
            {data.billingMonth}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#009688" }}>
            {data.billingDate}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ margin: "46px 84px 0 84px" }}>
        <Box sx={{ display: "flex", columnGap: "12px" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#000" }}>
            {data.companyName}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#000" }}>
            {data.customerName}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#000" }}>
          {data.address}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end" marginY="24px">
        <Typography fontSize="14px">{data.customerNumber}</Typography>
      </Box>
      <Grid container spacing={"8px"}>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>應繳金額</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h4" sx={{ color: "#009688" }}>
              {formatValue(data.amount)}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>繳費期限</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h4" sx={{ color: "#009688" }}>
              {data.dueDate}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>匯款資訊</Typography>
          </Box>
          <Box sx={styles.box}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                columnGap: "4px",
                width: "70%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: "1 4",
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#000" }}
                >
                  銀行
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#009688" }}
                >
                  {data.bank.bankName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: "1 4",
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#000" }}
                >
                  戶名
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#009688" }}
                >
                  {data.bank.accountName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: "1 4",
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#000" }}
                >
                  帳號
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#009688" }}
                >
                  {data.bank.accountNumber}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box marginTop={"12px"}>
        <Typography
          sx={{ fontSize: "16px", fontWeight: 700 }}
          textAlign={"center"}
        >
          轉供資料與明細
        </Typography>
        <Box sx={styles.table}>
          {/* Header */}
          <Grid container sx={styles.tableRow}>
            <Grid item xs={3} sx={{ ...styles.tableHeader, fontSize: "16px" }}>
              電號
            </Grid>
            <Grid item xs={3} sx={{ ...styles.tableHeader, fontSize: "16px" }}>
              轉供度數（度）
            </Grid>
            <Grid item xs={3} sx={{ ...styles.tableHeader, fontSize: "16px" }}>
              每度電單價（元/kWh）
            </Grid>
            <Grid item xs={3} sx={{ ...styles.tableHeader, fontSize: "16px" }}>
              電費（元）
            </Grid>
          </Grid>

          {/* Body */}
          {data.usage.map((usage, index) => (
            <Grid container key={index} sx={styles.tableRow}>
              <Grid item xs={3} sx={styles.tableCell}>
                {usage.serialNumber}
              </Grid>
              <Grid item xs={3} sx={styles.tableCell}>
                {formatValue(usage.kwh)}
              </Grid>
              <Grid item xs={3} sx={styles.tableCell}>
                {formatValue(usage.price, true)}
              </Grid>
              <Grid item xs={3} sx={styles.tableCell}>
                {formatValue(usage.amount)}
              </Grid>
            </Grid>
          ))}

          {/* Summary */}
          <Grid container sx={styles.tableRow}>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
              }}
            >
              度數合計
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
              }}
            >
              {formatValue(data.totalKwh)}度
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
              }}
            >
              電費合計
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
              }}
            >
              {formatValue(data.totalAmount)}元
            </Grid>
          </Grid>

          {/* Additional fees */}
          <Grid container>
            <Grid
              container
              sx={{
                ...styles.tableRow,
                borderRight: "1px solid #000",
              }}
              xs={6}
            >
              <Grid container>
                <Grid item xs={6} sx={styles.tableCell}>
                  代輸費
                </Grid>
                <Grid item xs={6} sx={styles.tableCell}>
                  {formatValue(data.substitutionFee)}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6} sx={styles.tableCell}>
                  憑證審查費
                </Grid>
                <Grid item xs={6} sx={styles.tableCell}>
                  {formatValue(data.certificationFee)}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6} sx={styles.tableCell}>
                  憑證服務費
                </Grid>
                <Grid item xs={6} sx={styles.tableCell}>
                  {formatValue(data.certificationServiceFee)}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                borderBottom: "1px solid #000",
              }}
              xs={6}
            >
              <Grid
                item
                xs={6}
                sx={{
                  ...styles.tableCell,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                規費合計
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  ...styles.tableCell,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data.totalFee}
              </Grid>
            </Grid>
          </Grid>

          {/* Total */}
          <Grid container sx={styles.tableRow}>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
                borderRight: "1px solid #000",
              }}
            >
              合計（未稅）
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                borderRight: "1px solid #000",
                fontSize: "16px",
              }}
            >
              {formatValue(data.total)}
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                borderRight: "1px solid #000",
                fontSize: "16px",
              }}
            >
              營業稅
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
              }}
            >
              {formatValue(data.tax)}
            </Grid>
          </Grid>
          <Grid container sx={styles.tableRow}>
            <Grid
              item
              xs={3}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
                borderRight: "1px solid #000",
              }}
            >
              總計（含稅）
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                ...styles.tableSummary,
                fontSize: "16px",
              }}
            >
              {formatValue(data.totalIncludeTax)} 元
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          fontSize: "12px",
          border: "1px solid #000",
          color: "#000",
          padding: "3px 5px",
        }}
      >
        1.
        轉供度數以台電公司寄給艾涅爾電力之「台灣電力股份有限公司繳費通知單」所載之代輸電力度數為準。
        2. 電費奉准以元為單位，不及一元者四捨五入計算。 3.
        憑證每達一千度累積電量，憑證中心核發一張，憑證之數量以憑證中心每個月核發之數量為準。
        4. 憑證附隨電能一併出售予用戶，不另外計價 。 5.
        本繳費憑證各項金額數目係由機器印出，如發現非機器列印或有塗改字跡，概屬無效
      </Box>
    </Box>
  );
});

UserBillTemplate.displayName = "UserBillTemplate";
export default UserBillTemplate;
