import { Box, Typography } from "@mui/material";
import type { TransferDocumentPowerPlantDto, PowerPlant } from "@core/graphql/types";

type TransferDocumentPowerPlantItem =
    Pick<TransferDocumentPowerPlantDto, 'estimateAnnualSupply' | 'transferRate'>
    & Pick<PowerPlant, 'name' | 'capacity'>;

const powerPlantMappedLabels: Array<{
    key: keyof Omit<TransferDocumentPowerPlantItem, 'name'>;
    label: string;
}> = [{
    key: 'capacity',
    label: '裝置容量',
}, {
    key: 'estimateAnnualSupply',
    label: '預計年採購度數',
}, {
    key: 'transferRate',
    label: '轉供比例',
}];

interface TransferDocumentPowerPlantProps {
    transferDocumentPowerPlants: TransferDocumentPowerPlantDto[];
}

interface TransferDocumentPowerPlantItemProps {
    transferDocumentPowerPlant: TransferDocumentPowerPlantItem;
}

function TransferDocumentPowerPlantItem(props: TransferDocumentPowerPlantItemProps) {
    const { transferDocumentPowerPlant } = props;

    return (
        <Box>
            <Typography variant="h4">{transferDocumentPowerPlant.name}</Typography>
            <Box>
                {powerPlantMappedLabels.map(({ key, label }) => (
                    <Box key={key}>
                        <Typography>{label}</Typography>
                        <Typography>{transferDocumentPowerPlant[key]}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function TransferDocumentPowerPlant(props: TransferDocumentPowerPlantProps) {
    const { transferDocumentPowerPlants } = props;

    const transferDocumentPowerPlantsView = transferDocumentPowerPlants.map(el => ({
        name: el.powerPlant.name,
        capacity: el.powerPlant.capacity,
        estimateAnnualSupply: el.estimateAnnualSupply,
        transferRate: el.transferRate,
      }));

    return (
        <Box
            sx={{
                maxWidth: '392px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: '2px',

            }}>
            {transferDocumentPowerPlantsView.map(item => (
               <TransferDocumentPowerPlantItem key={item.name} transferDocumentPowerPlant={item} /> 
            ))}
        </Box>
    );
}

export default TransferDocumentPowerPlant;
