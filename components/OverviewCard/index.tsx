import { Card, Grid, Skeleton, Typography, Box } from "@mui/material";
import { BasicInfo, BasicInfoProps } from "./BasicInfo";

export interface OverviewCardProps {
  topic: string;
  basicInfos: BasicInfoProps[];
  loading: boolean;
}

function BasicInfoSkeleton() {
  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <Box
        width="48px"
        height="48px"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
      <Box sx={{ flexGrow: 1, ml: 1 }}>
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
        <Box sx={{ display: "flex", alignItems: "flex-end", columnGap: "4px" }}>
          <Skeleton variant="text" width={60} height={32} />
          <Skeleton variant="text" width={20} height={20} />
        </Box>
      </Box>
    </Box>
  );
}

export default function OverviewCard(props: OverviewCardProps) {
  const { topic, basicInfos, loading } = props;
  return (
    <Card sx={{ p: "36px" }}>
      <Grid container spacing={1} rowGap="12px">
        <Grid item sm={12}>
          <Typography variant="h4">{topic}</Typography>
        </Grid>
        {loading ? (
          <>
            <Grid item sm={4}>
              <BasicInfoSkeleton />
            </Grid>
            <Grid item sm={4}>
              <BasicInfoSkeleton />
            </Grid>
            <Grid item sm={4}>
              <BasicInfoSkeleton />
            </Grid>
          </>
        ) : (
          basicInfos.map((info) => (
            <Grid key={info.name} item sm={4}>
              <BasicInfo {...info} />
            </Grid>
          ))
        )}
      </Grid>
    </Card>
  );
}
