import { Fee, UserBill } from "@core/graphql/types";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { forwardRef, useMemo } from "react";

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
  contentText: {
    fontSize: "9px",
  },
} as const;

interface UserBillProps {
  userBill: UserBill;
  fee: Fee;
}

/** @TODO check details */
const UserBill = forwardRef((props: UserBillProps, ref) => {
  const { userBill, fee } = props;
  console.log({ userBill });

  const electricNumberInfos = useMemo(() => {
    const f = userBill.electricNumberInfos.map((x) => x.number);
  }, [userBill]);

  return (
    <Box sx={styles.container} ref={ref}>
      <Box display="flex" justifyContent="space-between">
        <Box>logo</Box>
        <Box>繳費通知單</Box>
      </Box>
      <Box sx={{ margin: "46px 84px" }}>
        <Box sx={{ display: "flex", columnGap: "12px" }}>
          <Typography variant="h6">{userBill.contactName}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            聯絡人
          </Typography>
        </Box>
        <Typography variant="body4">{userBill.address}</Typography>
      </Box>
      <Grid container spacing={"8px"}>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>應繳金額</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h5" sx={{ color: "#009688" }}>
              {"2022.04.20"}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={styles.boxTitle}>繳費期限</Typography>
          </Box>
          <Box sx={styles.box}>
            <Typography variant="h5" sx={{ color: "#009688" }}>
              {userBill.estimatedBillDeliverDate}
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
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: "1 4",
                }}
              >
                <Typography variant="menuType">銀行</Typography>
                <Typography variant="menuType">
                  {`${userBill.recipientAccount.bankCode}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: "1 4",
                }}
              >
                <Typography variant="menuType">帳號</Typography>
                <Typography variant="menuType">
                  {userBill.recipientAccount.account}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box marginTop={"12px"}>
        <Typography
          sx={{ fontSize: "12px", fontWeight: 700 }}
          textAlign={"center"}
        >
          轉供資料與明細
        </Typography>
        <Table
          sx={{ minWidth: 700, marginTop: "4px", border: "solid 1px #000" }}
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={styles.itemTitle}>
                電號
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                發電廠
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                轉供度數（度）
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                每度電單價（元/kWh）
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                電費（元）
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center" rowSpan={3}>
                test-123
              </TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">2</TableCell>
              <TableCell align="center">3</TableCell>
              <TableCell align="center">4</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">2</TableCell>
              <TableCell align="center">3</TableCell>
              <TableCell align="center">4</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">2</TableCell>
              <TableCell align="center">3</TableCell>
              <TableCell align="center">4</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                colSpan={1}
                rowSpan={4}
                sx={styles.boxTitle}
              >
                合計
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                度數合計
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                14,808 度
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                電費合計
              </TableCell>
              <TableCell align="center" sx={styles.itemTitle}>
                73,296 元
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={1} sx={styles.contentText}>
                代輸費
              </TableCell>
              <TableCell align="center" colSpan={1} sx={styles.contentText}>
                {Number(fee.substitutionFee)}
              </TableCell>
              <TableCell align="center" colSpan={1} rowSpan={3}>
                規費合計
              </TableCell>
              <TableCell align="center" colSpan={1} rowSpan={3}>
                {Number(fee.substitutionFee) +
                  Number(fee.certificateServiceFee) +
                  Number(fee.certificateVerificationFee)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" colSpan={1} sx={styles.contentText}>
                憑證查驗費
              </TableCell>
              <TableCell align="center" colSpan={1} sx={styles.contentText}>
                {Number(fee.certificateVerificationFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={1} sx={styles.contentText}>
                憑證服務費
              </TableCell>
              <TableCell align="center" colSpan={1} sx={styles.contentText}>
                {Number(fee.certificateServiceFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">總計</TableCell>
              <TableCell align="center" colSpan={4}>
                123123
              </TableCell>
            </TableRow>
            {/* {rows.map((row) => (
              <TableRow key={row.desc}>
                <TableCell>{row.desc}</TableCell>
                <TableCell align="right">{row.qty}</TableCell>
                <TableCell align="right">{row.unit}</TableCell>
                <TableCell align="right">{ccyFormat(row.price)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tax</TableCell>
              <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
              <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell colSpan={5} sx={{ padding: "3px" }}>
                <Box sx={styles.contentText}>
                  本期計費期間：2022.03.01-2022.03.31 1.
                  轉供度數以台電公司寄給XXXX（售電業公司名稱）之「台灣電力股份有限公司繳費通知單」所載之代輸電力度數為準。
                  2.
                  如用戶逾期繳納金額，按中華郵政股份一年期定期儲金利率固定牌告利率加年息2.5%，計算遲延利息。3.
                  如用戶逾期繳納金額累計達1個月，並經定期催告仍無於一定期限內給付，依雙方簽訂契約之損害賠償責任辦理。4.
                  電費奉准以元為單位，不及一元者四捨五入計算。 5.
                  憑證每達一千度累積電量，憑證中心核發一張，憑證之數量以憑證中心每個月核發之數量為準。
                  6. 憑證附隨電能一併出售予用戶，不另外計價 。 7.
                  本繳費憑證各項金額數目係由機器印出，如發現非機器列印或有塗改字跡，概屬無效。
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
});

UserBill.displayName = "UserBill";
export default UserBill;
