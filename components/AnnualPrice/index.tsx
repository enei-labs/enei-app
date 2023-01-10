import { Card, Grid } from "@mui/material";
import { PriceBox } from "./PriceBox";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

export interface AnnualPriceProps {
  annualBuyPrice: string;
  annualSellPrice: string;
}

export default function AnnualPrice(props: AnnualPriceProps) {
  const { annualBuyPrice, annualSellPrice } = props;
  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <PriceBox
          icon={MonetizationOnOutlinedIcon}
          name="平均購電價格"
          price={annualBuyPrice}
          unit="元/kWh"
        />
      </Grid>
      <Grid item sm={6}>
        <PriceBox
          icon={MonetizationOnOutlinedIcon}
          name="平均售電價格"
          price={annualSellPrice}
          unit="元/kWh"
        />
      </Grid>
    </Grid>
  );
}
