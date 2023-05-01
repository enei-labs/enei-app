import { Card, Grid, Skeleton, Typography } from "@mui/material";
import { BasicInfo, BasicInfoProps } from "./BasicInfo";

export interface OverviewCardProps {
  topic: string;
  basicInfos: BasicInfoProps[];
  loading: boolean;
}

export default function OverviewCard(props: OverviewCardProps) {
  const { topic, basicInfos, loading } = props;
  return (
    <Card sx={{ p: "36px" }}>
      <Grid container spacing={1} rowGap="12px">
        <Grid item sm={12}>
          <Typography variant="h4">{topic}</Typography>
        </Grid>
        {basicInfos.map((info) => (
          <Grid key={info.name} item sm={4}>
            {loading ? <Skeleton variant="text" /> : <BasicInfo {...info} />}
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
