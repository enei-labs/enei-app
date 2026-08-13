import { useState } from "react";
import Chip from "@components/Chip";
import { TransferDocument } from "@core/graphql/types";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useTransferDocumentDegreeSummary } from "@utils/hooks/queries/useTransferDocumentDegreeSummary";

interface TransferDocumentInfoBoxProps {
  transferDocument: TransferDocument;
}

interface TransferBoxProps {
  title: string;
  count: number;
}

const TransferBox = (props: TransferBoxProps) => {
  const { title, count } = props;

  return (
    <Box>
      <Typography variant="body3">{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", columnGap: "4px" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {new Intl.NumberFormat().format(count)}
        </Typography>
        <Typography variant="body4">kWh</Typography>
      </Box>
    </Box>
  );
};

/** 轉供統計改由後端 SQL 聚合，不再抓整份文件的 transferDegrees 到前端計算 */
function TransferDocumentInfoBox(props: TransferDocumentInfoBoxProps) {
  const { transferDocument } = props;
  const [powerPlantId, setPowerPlantId] = useState<string | null>(null);

  const { data, loading } = useTransferDocumentDegreeSummary(
    transferDocument.id,
    powerPlantId
  );

  const summary = data?.transferDocumentDegreeSummary;

  return (
    <Box display={"flex"} flexDirection="column" rowGap="24px">
      <Box display={"flex"} gap="8px" flexWrap={"wrap"} marginY={"24px"}>
        {transferDocument.transferDocumentPowerPlants.map((item) => {
          return (
            <Chip
              key={item.powerPlant.id}
              label={item.powerPlant.name}
              handleClick={() => setPowerPlantId(item.powerPlant.id)}
              selected={powerPlantId === item.powerPlant.id}
            />
          );
        })}
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container>
            <Grid item sm={4}>
              <TransferBox
                title="本月轉供度數"
                count={summary?.thisMonthDegree ?? 0}
              />
            </Grid>
            <Grid item sm={4}>
              <TransferBox
                title="上月轉供度數"
                count={summary?.lastMonthDegree ?? 0}
              />
            </Grid>
            <Grid item sm={4}>
              <TransferBox
                title="年度累積轉供度數"
                count={summary?.thisYearDegree ?? 0}
              />
            </Grid>
          </Grid>

          <Divider />

          <Grid container>
            {(summary?.userSummaries ?? []).map((user) => (
              <Grid item sm={4} key={user.userId}>
                <TransferBox title={user.userName} count={user.degree} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default TransferDocumentInfoBox;
