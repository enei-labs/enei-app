import { Box, Typography, Divider } from "@mui/material";
import type {
  TransferDocumentPowerPlant,
  PowerPlant,
} from "@core/graphql/types";

type TransferDocumentPowerPlantItem = Pick<
  TransferDocumentPowerPlant,
  "estimateAnnualSupply" | "transferRate"
> &
  Pick<PowerPlant, "name" | "volume">;



const powerPlantMappedLabels: Array<{
  key:  "estimateSupplyVolumeNode" | "volumeNode" | "transferRateNode";
  label: string;
}> = [
  {
    key: "volumeNode",
    label: "裝置容量",
  },
  {
    key: "estimateSupplyVolumeNode",
    label: "預計年發電量",
  },
  {
    key: "transferRateNode",
    label: "轉供比例",
  },
];

interface TransferDocumentPowerPlantProps {
  transferDocumentPowerPlants: TransferDocumentPowerPlant[];
}

interface TransferDocumentPowerPlantItemProps {
  transferDocumentPowerPlant:  {
    nameNode: React.ReactNode;
    volumeNode: React.ReactNode;
    estimateSupplyVolumeNode: React.ReactNode;
    transferRateNode: React.ReactNode;
  };
}

function TransferDocumentPowerPlantItem(
  props: TransferDocumentPowerPlantItemProps
) {
  const { transferDocumentPowerPlant } = props;

  return (
    <Box sx={{ p: "8px 12px" }}>
      {transferDocumentPowerPlant.nameNode}
      <Box sx={{ display: "flex" }}>
        {powerPlantMappedLabels.map(({ key, label }) => (
          <Box sx={{ flexGrow: 1 }} key={key}>
            <Typography variant="body4">{label}</Typography>
            {transferDocumentPowerPlant[key]}
          </Box>
        ))}
      </Box>
      <Divider sx={{ margin: "8px 0" }} />
    </Box>
  );
}

function TransferDocumentPowerPlant(props: TransferDocumentPowerPlantProps) {
  const { transferDocumentPowerPlants } = props;

  const transferDocumentPowerPlantsView = transferDocumentPowerPlants.map(
    (el) => ({
      nameNode: (
        <Typography sx={{ m: "0 0 8px 0" }} variant="h5">
          {el.powerPlant.name}
        </Typography>
      ),
      volumeNode: (
        <Typography variant="body1">
          {el.powerPlant.volume / 1000}{" "}
          <Typography variant="body4">kWh</Typography>
        </Typography>
      ),
      estimateSupplyVolumeNode: (
        <Typography variant="body1">
          {(el.estimateAnnualSupply) * (100 / el.transferRate)} <Typography variant="body4">kWh</Typography>
        </Typography>
      ),
      transferRateNode: (
        <Typography variant="body1">
          {el.transferRate} <Typography variant="body4">%</Typography>
        </Typography>
      ),
    })
  );

  return (
    <Box
      sx={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
        height: "258px",
      }}
    >
      {transferDocumentPowerPlantsView.map((item) => (
        <TransferDocumentPowerPlantItem
          key={item.nameNode.props.children}
          transferDocumentPowerPlant={item}
        />
      ))}
    </Box>
  );
}

export default TransferDocumentPowerPlant;
