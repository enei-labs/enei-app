import { Card, Grid, Typography } from "@mui/material";
import { BasicInfo, BasicInfoProps } from "./BasicInfo";

export interface OverviewCardProps {
  topic: string;
  basicInfos: BasicInfoProps[];
}

export default function OverviewCard(props: OverviewCardProps) {
  const { topic, basicInfos } = props;
  return (
    <Card sx={{ p: "36px" }}>
      <Grid container spacing={1} rowGap="12px">
        <Grid item sm={12}>
          <Typography variant="h4">{topic}</Typography>
        </Grid>
        {basicInfos.map((info) => (
          <Grid key={info.name} item sm={4}>
            <BasicInfo {...info} />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
