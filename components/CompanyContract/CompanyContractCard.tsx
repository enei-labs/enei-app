import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { CompanyContract } from "@core/graphql/types";
import FlagIcon from "@mui/icons-material/OutlinedFlag";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { formatDateTime } from "@utils/format";
import InfoBox from "../InfoBox";

interface CompanyContractCardProps {
  companyContract: CompanyContract;
}

const styles = {
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: 260,
  },
} as const;

function CompanyContractCard(props: CompanyContractCardProps) {
  const { companyContract } = props;
  const degrees = 20;

  const companyContractInfo = [
    {
      icon: MonetizationOnOutlinedIcon,
      label: "合約價格",
      content: companyContract.price,
      unit: "元/kWh",
    },
    {
      icon: EventOutlinedIcon,
      label: "合約起始日期",
      content: formatDateTime(companyContract.startedAt),
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: "轉供率要求",
      content: companyContract.transferRate,
      unit: "%",
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: "正式轉供日",
      content: formatDateTime(companyContract.transferAt),
    },
    {
      icon: CreditCardOutlinedIcon,
      label: "付款條件",
      content: companyContract.daysToPay,
      unit: "天",
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: "合約結束日期",
      content: formatDateTime(companyContract.endedAt),
    },
    {
      icon: AccessTimeOutlinedIcon,
      label: "合約年限",
      content: companyContract.duration,
      unit: "年",
    },
  ];

  const contactInfo = [
    {
      icon: AccessTimeOutlinedIcon,
      label: "聯絡人",
      content: companyContract.contactName,
    },
    {
      icon: AccessTimeOutlinedIcon,
      label: "聯絡人電話",
      content: companyContract.contactPhone,
    },
    {
      icon: AccessTimeOutlinedIcon,
      label: "聯絡人信箱",
      content: companyContract.contactEmail,
    },
  ];

  return (
    <Card sx={{ p: "36px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{`${companyContract.id}(${companyContract.name})`}</Typography>
        <Box sx={{ display: "flex" }}>edit</Box>
      </Box>
      <Box>
        <Box sx={{ display: "flex", columnGap: "24px" }}>
          <Box>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">一年內待銷售度數</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider orientation="vertical" />
          <Grid container>
            {companyContractInfo.map((c, index) => (
              <Grid item sm={6} key={`${c.label}-${index}`}>
                <InfoBox
                  icon={c.icon}
                  label={c.label}
                  content={c.content}
                  unit={c.unit}
                />
              </Grid>
            ))}
          </Grid>
          <Divider orientation="vertical" />
          <Grid container>
            {contactInfo.map((c, index) => (
              <Grid item sm={12} key={`${c.label}-${index}`}>
                <InfoBox icon={c.icon} label={c.label} content={c.content} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Card>
  );
}

export default CompanyContractCard;
