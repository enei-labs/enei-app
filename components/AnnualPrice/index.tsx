import { Grid, Skeleton } from "@mui/material";
import { PriceBox } from "./PriceBox";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

export interface AnnualPriceProps {
  averagePurchasePrice: string;
  averageSellingPrice: string;
  loading?: boolean;
}

export default function AnnualPrice(props: AnnualPriceProps) {
  const { averagePurchasePrice, averageSellingPrice, loading = false } = props;
  
  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid item sm={6}>
          <PriceBoxSkeleton />
        </Grid>
        <Grid item sm={6}>
          <PriceBoxSkeleton />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <PriceBox
          icon={MonetizationOnOutlinedIcon}
          name="平均購電價格"
          price={averagePurchasePrice}
          unit="元/kWh"
        />
      </Grid>
      <Grid item sm={6}>
        <PriceBox
          icon={PaymentOutlinedIcon}
          name="平均售電價格"
          price={averageSellingPrice}
          unit="元/kWh"
        />
      </Grid>
    </Grid>
  );
}

function PriceBoxSkeleton() {
  return (
    <div>
      <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={100} />
      </div>
      <Skeleton 
        variant="rectangular" 
        height={260} 
        sx={{ borderRadius: "10px" }} 
      />
    </div>
  );
}
