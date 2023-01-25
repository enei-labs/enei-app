import { Box, Grid, Typography } from "@mui/material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

interface ContractBoxProps {
  title: string;
  subtitle: string;
}

const styles = {
  box: {
    border: "2px solid #B2DFDB",
    borderRadius: "16px",
    padding: "16px",
  },
} as const;

function ContractBox(props: ContractBoxProps) {
  const { title, subtitle } = props;
  return (
    <Box sx={styles.box}>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="subtitle2">{subtitle}</Typography>
      <Grid container>
        <Grid item sm={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MonetizationOnOutlinedIcon />
            <Box sx={{ ml: "12px" }}>
              <Typography variant="body4">合約價格</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography variant="h6">5.2</Typography>
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
                <Typography variant="h6">2022.06.28</Typography>
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
                <Typography variant="h6">90</Typography>
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
                <Typography variant="h6">2022.06.28</Typography>
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
                <Typography variant="h6">28</Typography>
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
                <Typography variant="h6">2022.06.27</Typography>
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
                <Typography variant="h6">10</Typography>
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
