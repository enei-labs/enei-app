import { Box, Typography, Divider } from "@mui/material";
import type { TransferDocumentPowerPlantDto, PowerPlant } from "@core/graphql/types";

type TransferDocumentPowerPlantItem =
    Pick<TransferDocumentPowerPlantDto, 'estimateAnnualSupply' | 'transferRate'>
    & Pick<PowerPlant, 'name' | 'capacity'>;

type TransferDocumentPowerPlantItemView = {
    [key in keyof TransferDocumentPowerPlantItem as `${key}Node`]: React.ReactNode;
};

const powerPlantMappedLabels: Array<{
    key: keyof Omit<TransferDocumentPowerPlantItemView, 'name'>;
    label: string;
}> = [{
    key: 'capacityNode',
    label: '裝置容量',
}, {
    key: 'estimateAnnualSupplyNode',
    label: '預計年採購度數',
}, {
    key: 'transferRateNode',
    label: '轉供比例',
}];

interface TransferDocumentPowerPlantProps {
    transferDocumentPowerPlants: TransferDocumentPowerPlantDto[];
}

interface TransferDocumentPowerPlantItemProps {
    transferDocumentPowerPlant: TransferDocumentPowerPlantItemView;
}

function TransferDocumentPowerPlantItem(props: TransferDocumentPowerPlantItemProps) {
    const { transferDocumentPowerPlant } = props;

    return (
        <Box sx={{ p: '8px 12px' }}>
            {transferDocumentPowerPlant.nameNode}
            <Box sx={{ display: 'flex' }}>
                {powerPlantMappedLabels.map(({ key, label }) => (
                    <Box sx={{ flexGrow: 1 }} key={key}>
                        <Typography variant="body4">{label}</Typography>
                        {transferDocumentPowerPlant[key]}
                    </Box>
                ))}
            </Box>
            <Divider sx={{ margin: '8px 0' }} />
        </Box>
    );
}

function TransferDocumentPowerPlant(props: TransferDocumentPowerPlantProps) {
    const { transferDocumentPowerPlants } = props;

    const transferDocumentPowerPlantsView = transferDocumentPowerPlants.map(el => ({
        nameNode: (
            <Typography sx={{ m: '0 0 8px 0' }} variant="h5">{el.powerPlant.name}</Typography>
        ),
        capacityNode: (
            <Typography variant="body1">{el.powerPlant.capacity}<Typography variant="body4">kWh</Typography></Typography>
        ),
        estimateAnnualSupplyNode: (
            <Typography variant="body1">{el.estimateAnnualSupply}<Typography variant="body4">MWh</Typography></Typography>
        ),
        transferRateNode: (
            <Typography variant="body1">{el.transferRate}<Typography variant="body4">%</Typography></Typography>
        ),
      }));

    return (
        <Box
            sx={{
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: '8px',
                height: '258px',
            }}>
            {transferDocumentPowerPlantsView.map(item => (
               <TransferDocumentPowerPlantItem key={item.nameNode.props.children} transferDocumentPowerPlant={item} /> 
            ))}
        </Box>
    );
}

export default TransferDocumentPowerPlant;
