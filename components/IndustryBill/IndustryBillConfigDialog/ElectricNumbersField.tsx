import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import { FormData } from "./FormData";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import {
  Control,
  Controller,
  ControllerRenderProps,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { IconBtn } from "@components/Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DialogAlert from "@components/DialogAlert";
import { useCompanyContracts } from "@utils/hooks/queries";
import { IndustryBillConfig, PowerPlant } from "@core/graphql/types";

const INITIAL_ADD_COUNT = 1;
const INITIAL_DELETE_INDEX = -1;

const DeleteConfirmDialog = memo(({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <DialogAlert
    open={open}
    title={"刪除發電業電號欄位"}
    content={"是否確認要刪除發電業電號欄位？"}
    onConfirm={onConfirm}
    onClose={onClose}
  />
));

const AddFieldSection = memo(({
  addCount,
  onAddCountChange,
  onAdd,
}: {
  addCount: number;
  onAddCountChange: (count: number) => void;
  onAdd: () => void;
}) => (
  <Grid
    container
    justifyContent={"space-between"}
    alignItems={"center"}
    flexWrap={"nowrap"}
    padding={"8px 16px"}
    border={"2px dashed #B2DFDB"}
    borderRadius={"16px"}
  >
    <Grid container flexWrap={"nowrap"} alignItems={"center"} gap={"8px"}>
      <Typography variant="subtitle2">新增</Typography>
      <InputNumber
        sx={{ width: "74px" }}
        value={addCount}
        onChange={(value: any) => onAddCountChange(value)}
      />
      <Typography variant="subtitle2">個發電業電號欄位</Typography>
    </Grid>
    <Grid container justifyContent={"flex-end"}>
      <Button startIcon={<AddCircleOutlineOutlinedIcon />} onClick={onAdd}>
        新增
      </Button>
    </Grid>
  </Grid>
));

interface ElectricNumbersFieldProps {
  control: Control<FormData>;
  field: ControllerRenderProps<FormData, "electricNumberInfos">;
  companyId: string;
  currentModifyIndustryBillConfig?: IndustryBillConfig;
}

export function ElectricNumbersField(props: ElectricNumbersFieldProps) {
  const {
    field: rootField,
    control,
    companyId,
    currentModifyIndustryBillConfig,
  } = props;

  const { data, loading } = useCompanyContracts({
    variables: { companyId },
  });

  const [addElectricNumber, setAddElectricNumber] = useState<number>(INITIAL_ADD_COUNT);
  const [deleteElectricNumberIndex, setDeleteElectricNumberIndex] =
    useState<number>(INITIAL_DELETE_INDEX);

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  const formData = useWatch({ control, name: rootField?.name }) as FormData["electricNumberInfos"];

  const priceMap = useMemo(() => new Map<string, number>(), []);

  const flattenPowerPlants = useMemo(() => {
    if (loading) return [];
    return (
      data?.companyContracts.list.reduce((agg: PowerPlant[], curr) => {
        if (!curr.powerPlants || !curr.powerPlants.length) return agg;
        curr.powerPlants.forEach((info) => {
          priceMap.set(info.number, Number(curr.price ?? 0));
        });
        return [...agg, ...curr.powerPlants];
      }, [] as PowerPlant[]) ?? []
    );
  }, [data, loading, priceMap]);

  const initializeFormData = useCallback(() => {
    if (
      !loading &&
      data &&
      currentModifyIndustryBillConfig?.electricNumbers?.length &&
      flattenPowerPlants.length &&
      fields.length === 0
    ) {
      const initialValues = currentModifyIndustryBillConfig.electricNumbers
        .map((number) => {
          const powerPlant = flattenPowerPlants.find((p) => p.number === number);
          if (powerPlant && powerPlant.number) {
            return {
              number: {
                label: `${powerPlant.number} ${powerPlant.name}`,
                value: powerPlant.number,
              },
              price: (priceMap.get(powerPlant.number) || 0).toString(),
            };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (initialValues.length > 0) {
        append(initialValues);
      }
    }
  }, [
    loading,
    data,
    currentModifyIndustryBillConfig,
    flattenPowerPlants,
    fields.length,
    append,
    priceMap,
  ]);

  useEffect(() => {
    initializeFormData();
  }, [initializeFormData]);

  const handleAddElectricNumbers = useCallback(() => {
    const emptyFields = Array.from({ length: addElectricNumber }, () => ({
      number: { label: "", value: "" },
      price: "0",
    }));
    append(emptyFields);
  }, [addElectricNumber, append]);

  if (loading) return <CircularProgress size="24px" />;

  return (
    <>
      {fields.map((field, fieldIndex) => {
        const selectedNumbers = formData
          ?.filter(
            (item, index) => index !== fieldIndex && item?.number?.value
          )
          .map((item) => item.number.value) || [];

        const currentElectricNumber =
          currentModifyIndustryBillConfig?.electricNumbers?.[fieldIndex];

        const autocompleteOptions = flattenPowerPlants.map((o) => {
          const isSelected = currentElectricNumber === o.number;
          return {
            label: `${o.number} ${o.name}`,
            value: isSelected ? currentElectricNumber : o.number,
            disabled: selectedNumbers.includes(o.number),
          };
        });

        const currentPrice = (priceMap.get(formData?.[fieldIndex]?.number?.value) ?? 0).toString();

        return (
          <Box display={"flex"} key={field.id} columnGap="12px">
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.number` as const}
              render={({ field }) => (
                <InputAutocomplete
                  sx={{ width: "70%" }}
                  {...field}
                  onChange={field.onChange}
                  options={autocompleteOptions}
                  label={`發電業電號${fieldIndex + 1}`}
                  placeholder={"請填入"}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.price` as const}
              render={({ field }) => (
                <InputText
                  sx={{ width: "30%" }}
                  disabled
                  {...field}
                  label={`費率（元/kWh）`}
                  value={currentPrice}
                />
              )}
            />
            <IconBtn 
              icon={<CloseIcon />} 
              onClick={() => setDeleteElectricNumberIndex(fieldIndex)} 
            />
          </Box>
        );
      })}

      <AddFieldSection
        addCount={addElectricNumber}
        onAddCountChange={setAddElectricNumber}
        onAdd={handleAddElectricNumbers}
      />

      {deleteElectricNumberIndex !== INITIAL_DELETE_INDEX && (
        <DeleteConfirmDialog
          open={deleteElectricNumberIndex !== INITIAL_DELETE_INDEX}
          onConfirm={() => {
            remove(deleteElectricNumberIndex);
            setDeleteElectricNumberIndex(INITIAL_DELETE_INDEX);
          }}
          onClose={() => {
            setDeleteElectricNumberIndex(INITIAL_DELETE_INDEX);
          }}
        />
      )}
    </>
  );
}
