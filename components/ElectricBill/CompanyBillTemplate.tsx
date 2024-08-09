export interface CompanyBillTemplateData {
  // 計費年月
  billingMonth: string;
  // 計費期間
  billingDate: string;
  // 公司名稱
  companyName: string;
  // 負責人名稱
  responsibleName: string;
  // 轉供單編號
  transferNumber: string;
  // 電號
  serialNumber: string;
  // 電廠名稱
  powerPlantName: string;
  // 契約編號
  contractNumber: string;
  // 基本資訊
  basicInfo: {
    // 併聯容量
    totalCapacity: number;
    // 轉供容量
    transferCapacity: number;
  };
  // 廠址
  address: string;
  // 電費計算
  billing: {
    // 轉供度數
    transferKwh: number;
    // 費率
    price: number;
    // 電費（未稅）
    amount: number;
    // 營業稅
    tax: number;
    // 總金額
    totalIncludeTax: number;
  };
}

import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { forwardRef } from "react";
import Logo from "public/logo-with-name.svg";

const styles = {
  container: {
    // width: 595,
    backgroundColor: "#FFF",
    padding: "32px 24px",
  },
  boxTitle: {
    fontSize: "12px",
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
  section: {
    border: "1px solid #000",
    borderRadius: "4px",
    padding: "8px",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "4px",
  },
} as const;

interface CompanyBillProps {
  data: CompanyBillTemplateData;
}

/** @TODO check details */
const CompanyBillTemplate = forwardRef((props: CompanyBillProps, ref) => {
  const { data } = props;

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
      <Box sx={{ margin: "46px 84px" }}>
        <Box sx={{ display: "flex", columnGap: "12px" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#000" }}>
            {data.companyName}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#000" }}>
            {data.responsibleName}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#000" }}>
          {data.address}
        </Typography>
      </Box>
      <Grid container spacing={"8px"}>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>電號</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h4" sx={{ color: "#009688" }}>
              {data.serialNumber}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>電廠名稱</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h4" sx={{ color: "#009688" }}>
              {data.powerPlantName}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>契約編號</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h4" sx={{ color: "#009688" }}>
              {data.contractNumber}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <Box
          sx={{
            display: "flex",
            mt: "12px",
            justifyContent: "space-between",
            flex: "5 5",
            columnGap: "12px",
          }}
        >
          <Box>
            <Paper elevation={0} sx={styles.section}>
              <Typography sx={styles.sectionTitle}>基本資訊</Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>併聯容量：</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{data.basicInfo.totalCapacity}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>轉供容量：</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{data.basicInfo.transferCapacity}</Typography>
                </Grid>
              </Grid>
            </Paper>
            <Paper elevation={0} sx={styles.section}>
              <Typography sx={styles.sectionTitle}>廠址</Typography>
              <Typography>{data.address}</Typography>
            </Paper>
          </Box>
          <Paper elevation={0} sx={styles.section}>
            <Typography sx={styles.sectionTitle}>電費計算</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography>轉供度數：</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {data.billing.transferKwh.toLocaleString()} kWh
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>費率：</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{data.billing.price.toFixed(2)} 元/kWh</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>電費（未稅）：</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {data.billing.amount.toLocaleString()} 元
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>營業稅：</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{data.billing.tax.toLocaleString()} 元</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold" }}>總金額：</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {data.billing.totalIncludeTax.toLocaleString()} 元
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
      <Box
        sx={{
          fontSize: "12px",
          border: "1px solid #000",
          color: "#000",
          padding: "3px 5px",
        }}
      >
        本期計費期間：2022.03.01-2022.03.31 1. 1.
        轉供度數以台電公司寄給艾涅爾電力之「台灣電力股份有限公司繳費通知單」所載之代輸電力度數為準。
        2. 電費奉准以元為單位，不及一元者四捨五入計算。 3.
        憑證每達一千度累積電量，憑證中心核發一張，憑證之數量以憑證中心每個月核發之數量為準。
        4. 憑證附隨電能一併出售予用戶，不另外計價 。 5.
        本繳費憑證各項金額數目係由機器印出，如發現非機器列印或有塗改字跡，概屬無效
      </Box>
    </Box>
  );
});

CompanyBillTemplate.displayName = "CompanyBillTemplate";
export default CompanyBillTemplate;
