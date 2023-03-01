import { Box, Grid, Typography } from "@mui/material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { CompanyContract } from "@core/graphql/types";
import { formatDateTime } from "@utils/format";

interface ContractBoxProps {
  contract: CompanyContract;
}

const styles = {
  box: {
    border: "2px solid #B2DFDB",
    borderRadius: "16px",
    padding: "16px",
  },
} as const;

function ContractBox(props: ContractBoxProps) {
  const { contract } = props;

  return (
    <Box sx={styles.box}>
      <Typography variant="h5">{`${contract.number}(${contract.name})`}</Typography>
      <Typography variant="subtitle2">3,000MWh</Typography>
      <Grid container>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MonetizationOnOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">合約價格</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">{contract.price}</Typography>
                <Typography variant="body4">元/kWh</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EventOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">合約起始日期</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">
                  {formatDateTime(contract.startedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingUpOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">轉供率要求</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">{contract.transferRate}</Typography>
                <Typography variant="body4">%</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingUpOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">正式轉供日</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">
                  {formatDateTime(contract.transferAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CreditCardOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">付款條件</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">{contract.daysToPay}</Typography>
                <Typography variant="body4">天</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingUpOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">合約結束日期</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">
                  {formatDateTime(contract.endedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">合約年限</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">{contract.duration}</Typography>
                <Typography variant="body4">年</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContractBox;
