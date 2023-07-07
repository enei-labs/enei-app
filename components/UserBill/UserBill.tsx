import { UserBill } from "@core/graphql/types";
import { Box, Grid, Typography } from "@mui/material";

const styles = {
  container: {
    width: 595,
    backgroundColor: "#FFF",
    padding: "32px 24px",
  },
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: "172px",
    marginTop: "10px",
  },
} as const;

interface UserBillProps {
  userBill: UserBill;
}

export function UserBill(props: UserBillProps) {
  const { userBill } = props;
  console.log({ userBill });
  return (
    <Box sx={styles.container}>
      <Box display="flex" justifyContent="space-between">
        <Box>logo</Box>
        <Box>繳款通知單</Box>
      </Box>
      <Box>綠電用戶名稱 聯絡人</Box>
      <Box>
        <Box>應繳金額</Box>
        <Grid container>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <Typography variant="body2">應繳金額</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {"2022.04.20"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <Typography variant="body2">繳費期限</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {"2022.04.20"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <Typography variant="body2">匯款資訊</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {"-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box>轉供資料與明細</Box>
        <Box>content</Box>
      </Box>
    </Box>
  );
}
