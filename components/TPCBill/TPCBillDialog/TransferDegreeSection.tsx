import React from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import InputText from "@components/Input/InputText";
import Chip from "@components/Chip";
import { TransferDocument } from "@core/graphql/types";

interface UserItem {
  user: { id: string; name: string };
  userContract: any;
  electricNumberInfo?: { number?: string };
}

interface PowerPlantItem {
  powerPlant: { id: string; name: string };
}

interface TransferDocumentData {
  transferDocument: TransferDocument;
}

interface TransferDegreeSectionProps {
  control: any;
  transferDocumentData?: TransferDocumentData;
  selectedPowerPlant: string | null;
  selectPowerPlant: (id: string) => void;
  transferDocumentValue: {
    label: string;
    value: string;
  } | null;
}

export default function TransferDegreeSection({
  control,
  transferDocumentData,
  selectedPowerPlant,
  selectPowerPlant,
  transferDocumentValue,
}: TransferDegreeSectionProps) {
  return (
    <>
      <Typography textAlign="left" variant="h5">
        轉供度數
      </Typography>
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
                handleClick={() => selectPowerPlant(item.powerPlant.id)}
              />
            ))}
          </Box>
          {transferDocumentData.transferDocument.transferDocumentUsers.map(
            (item) => {
              if (!item.userContract) return null;
              const fieldBase = `transferDegrees.${item.user.id}_${item.userContract.id}_${selectedPowerPlant}_${item.electricNumberInfo?.number}`;
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
