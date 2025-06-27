import { useMemo, useState } from "react";
import groupBy from "lodash/groupBy";
import Chip from "@components/Chip";
import {
  TpcBillPage,
  TransferDegree,
  TransferDocument,
} from "@core/graphql/types";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useTpcBills } from "@utils/hooks/queries";

interface TransferDocumentInfoBoxProps {
  transferDocument: TransferDocument;
  tpcBillPage?: TpcBillPage;
  loading: boolean;
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

/** @TODO  */
function TransferDocumentInfoBox(props: TransferDocumentInfoBoxProps) {
  const { transferDocument, loading, tpcBillPage } = props;
  const [powerPlantId, setPowerPlantId] = useState<string | null>(null);

  const { refetch } = useTpcBills({
    transferDocumentId: transferDocument.id,
  });

  const powerPlantsMap = useMemo(() => {
    const map = new Map<string, TransferDegree[]>();
    if (tpcBillPage) {
      tpcBillPage.list.forEach((tpcBill) => {
        tpcBill.transferDegrees.forEach((t) => {
          if (map.has(t.powerPlant.id)) {
            map.set(
              t.powerPlant.id,
              (map.get(t.powerPlant.id) as TransferDegree[]).concat(t)
            );
          } else {
            map.set(t.powerPlant.id, [t]);
          }
        });
      });
    }
    return map;
  }, [tpcBillPage]);

  const currentPowerPlant = useMemo(() => {
    if (!powerPlantId) return null;
    const transferDegrees = powerPlantsMap.get(powerPlantId);
    if (!transferDegrees) return null;

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 這年的 1 月 1 日
    const endOfYear = new Date(currentYear + 1, 0, 1); // 下一年的 1 月 1 日
    const transferDegreesThisYear = transferDegrees.filter((transferDegree) => {
      const transferCreateTime = new Date(transferDegree.createdAt);
      return (
        transferCreateTime >= startOfYear && transferCreateTime < endOfYear
      );
    });
    const currentMonth = new Date().getMonth();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const transferDegreesThisMonth = transferDegrees.filter(
      (transferDegree) => {
        const transferCreateTime = new Date(transferDegree.createdAt);

        return (
          transferCreateTime >= startOfMonth && transferCreateTime <= endOfMonth
        );
      }
    );

    const groupByUserTransferDegrees = groupBy(
      transferDegreesThisMonth,
      (transferDegree) => transferDegree.user.id
    );

    const transferDegreesUserList = (
      Object.values(groupByUserTransferDegrees) ?? []
    ).map((transferDegrees) => ({
      ...transferDegrees[0].user,
      aggregateTransferDegrees: transferDegrees.reduce(
        (acc, curr) => acc + curr.degree,
        0
      ),
    }));

    return {
      transferDegreesThisMonth,
      transferDegreesUserList,
      aggregateTransferDegreesLastMonth: 0,
      aggregateTransferDegreesThisMonth: transferDegreesThisMonth.reduce(
        (acc, curr) => acc + curr.degree,
        0
      ),
      aggregateTransferDegreesThisYear: transferDegreesThisYear.reduce(
        (acc, curr) => acc + curr.degree,
        0
      ),
    };
  }, [powerPlantId, powerPlantsMap]);

  if (loading) return <CircularProgress />;

  return (
    <Box display={"flex"} flexDirection="column" rowGap="24px">
      <Box display={"flex"} gap="8px" flexWrap={"wrap"} marginY={"24px"}>
        {transferDocument.transferDocumentPowerPlants.map((item, index) => {
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
      <Grid container>
        <Grid item sm={4}>
          <TransferBox
            title="本月轉供度數"
            count={currentPowerPlant?.aggregateTransferDegreesThisMonth ?? 0}
          />
        </Grid>
        <Grid item sm={4}>
          <TransferBox
            title="上月轉供度數"
            count={currentPowerPlant?.aggregateTransferDegreesLastMonth ?? 0}
          />
        </Grid>
        <Grid item sm={4}>
          <TransferBox
            title="年度累積轉供度數"
            count={currentPowerPlant?.aggregateTransferDegreesThisYear ?? 0}
          />
        </Grid>
      </Grid>

      <Divider />

      <Grid container>
        {currentPowerPlant?.transferDegreesUserList.map((user) => (
          <Grid item sm={4} key={user.id}>
            <TransferBox
              title={user.name}
              count={user.aggregateTransferDegrees}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TransferDocumentInfoBox;
