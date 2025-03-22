import { Box, Typography } from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import InputText from "@components/Input/InputText";
import Chip from "@components/Chip";
import { PowerPlant, TransferDocument } from "@core/graphql/types";
// import ImportTransferDegreeBtn from "@components/TPCBill/TPCBillDialog/ImportTransferDegreeBtn";
import { FormData } from "@components/TPCBill/TPCBillDialog/FormData";

interface TransferDocumentData {
  transferDocument: TransferDocument;
}

interface TransferDegreeSectionProps {
  transferDocumentData?: TransferDocumentData;
  selectedPowerPlant: PowerPlant | null;
  selectPowerPlant: (powerPlant: PowerPlant) => void;
}

export default function TransferDegreeSection({
  transferDocumentData,
  selectedPowerPlant,
  selectPowerPlant,
}: TransferDegreeSectionProps) {
  const { control, setValue } = useFormContext<FormData>();
  const transferDocumentValue = useWatch({ control, name: "transferDocument" });
  const transferDegreesValue = useWatch({ control, name: "transferDegrees" });
  // const handleExcelParsed = (
  //   data: Map<string, { degree: number; fee: number }>
  // ) => {
  //   data.forEach((value, key) => {
  //     const [userNumber, industryNumber] = key.split("-");
  //     const fieldBase =
  //       `transferDegrees.${industryNumber}_${userNumber}` as const;
  //     setValue(fieldBase, {
  //       ...transferDegreesValue?.[fieldBase],
  //       degree: value.degree,
  //       fee: value.fee.toString(),
  //     });
  //   });
  // };

  // console.log({ transferDegreesValue });

  return (
    <>
      {/* <Box display="flex" justifyContent="space-between">
        <Typography textAlign="left" variant="h5">
          轉供度數
        </Typography>
        <ImportTransferDegreeBtn onExcelParsed={handleExcelParsed} />
      </Box> */}
      {transferDocumentData?.transferDocument.transferDocumentPowerPlants &&
      transferDocumentValue ? (
        <Box display="flex" flexDirection="column" rowGap="24px">
          <Box display="flex" gap="8px" flexWrap="wrap">
            {(
              transferDocumentData.transferDocument
                .transferDocumentPowerPlants ?? []
            ).map((item) => (
              <Chip
                key={item.powerPlant.id}
                label={item.powerPlant.name}
                handleClick={() => selectPowerPlant(item.powerPlant)}
              />
            ))}
          </Box>
          {transferDocumentData.transferDocument.transferDocumentUsers.map(
            (item) => {
              if (!item.user && !selectedPowerPlant) return null;
              const fieldBase =
                `transferDegrees.${selectedPowerPlant?.number}_${item.electricNumberInfo?.number}` as const;

              return (
                <Box
                  key={fieldBase}
                  gap="12px"
                  display="flex"
                  flexDirection="column"
                  border="1px solid #E0E0E0"
                  borderRadius="8px"
                  padding="16px"
                >
                  <Typography variant="h6">
                    {`${item.user.name}(${item.electricNumberInfo?.number ?? ""})`}
                  </Typography>
                  <Controller
                    control={control}
                    name={`${fieldBase}.degree`}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        type="number"
                        label="轉供度數(kWh)"
                      />
                    )}
                    rules={{ min: 0 }}
                  />
                  <Controller
                    control={control}
                    name={`${fieldBase}.fee`}
                    render={({ field }) => (
                      <InputText {...field} type="number" label="費用" />
                    )}
                  />
                  {/* <Controller
                    control={control}
                    name={`${fieldBase}.userContractId`}
                    defaultValue={item.userContract?.id ?? ""}
                    render={({ field }) => (
                      <input
                        type="hidden"
                        {...field}
                        value={item.userContract?.id}
                      />
                    )}
                  /> */}
                  <Controller
                    control={control}
                    name={`${fieldBase}.userId`}
                    defaultValue={item.user?.id ?? ""}
                    render={({ field }) => (
                      <input type="hidden" {...field} value={item.user?.id} />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`${fieldBase}.powerPlantId`}
                    defaultValue={selectedPowerPlant?.id ?? ""}
                    render={({ field }) => (
                      <input
                        type="hidden"
                        {...field}
                        value={selectedPowerPlant?.id}
                      />
                    )}
                  />
                </Box>
              );
            }
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" rowGap="24px">
          <Typography variant="h6">請選擇轉供契約編號</Typography>
        </Box>
      )}
    </>
  );
}
