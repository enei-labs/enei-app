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
import { useState } from "react";
import { IconBtn } from "@components/Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DialogAlert from "@components/DialogAlert";
import { useCompanyContracts } from "@utils/hooks/queries";
import { PowerPlant } from "@core/graphql/types";

interface ElectricNumbersFieldProps {
  control: Control<any, any>;
  field: ControllerRenderProps<FormData, any>;
  companyId: string;
}

export function ElectricNumbersField(props: ElectricNumbersFieldProps) {
  const { field: rootField, control, companyId } = props;

  const { data, loading } = useCompanyContracts({
    variables: { companyId },
  });

  const [addElectricNumber, setAddElectricNumber] = useState<number>(1);
  const [deleteElectricNumberIndex, setDeleteElectricNumberIndex] =
    useState<number>(-1);

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  const formData = useWatch({ control, name: rootField?.name });

  if (loading) return <CircularProgress size="24px" />;

  const priceMap = new Map();

  const flattenPowerPlants =
    data?.companyContracts.list.reduce((agg: PowerPlant[], curr) => {
      if (!curr.powerPlants || !curr.powerPlants.length) return agg;
      curr.powerPlants.forEach((info) => {
        priceMap.set(info.number, curr.price);
      });
      return [...agg, ...curr.powerPlants];
    }, [] as PowerPlant[]) ?? [];

  return (
    <>
      {fields.map((field, fieldIndex) => {
        const selectedNumbers =
          formData
            ?.filter(
              (item: any, index: number) =>
                index !== fieldIndex && item?.number?.value
            )
            .map((item: any) => item.number.value) || [];
        return (
          <Box display={"flex"} key={field.id} columnGap="12px">
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.number`}
              render={({ field }) => {
                return (
                  <InputAutocomplete
                    sx={{ width: "600px" }}
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    options={
                      flattenPowerPlants.map((o) => ({
                        label: o.number,
                        value: o.number,
                        disabled: selectedNumbers.includes(o.number),
                      })) ?? []
                    }
                    label={`發電業電號${fieldIndex + 1}`}
                    placeholder={"請填入"}
                    required
                  />
                );
              }}
            />
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.price`}
              render={({ field }) => {
                return (
                  <InputText
                    disabled
                    {...field}
                    label={`費率（元/kWh）`}
                    value={
                      priceMap.get(formData?.[fieldIndex]?.price?.value) ?? 0
                    }
                  />
                );
              }}
            />
            <IconBtn
              icon={<CloseIcon />}
              onClick={() => setDeleteElectricNumberIndex(fieldIndex)}
            />
          </Box>
        );
      })}

      {/* 新增用戶電號欄位 */}
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
            value={addElectricNumber}
            onChange={(number: any) => {
              setAddElectricNumber(number);
            }}
          ></InputNumber>
          <Typography variant="subtitle2">個發電業電號欄位</Typography>
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => {
              const emptyArray = [];
              for (let i = 1; i <= addElectricNumber; i++) {
                emptyArray.push({});
              }

              append(emptyArray);
            }}
          >
            新增
          </Button>
        </Grid>
      </Grid>

      {deleteElectricNumberIndex !== -1 ? (
        <DialogAlert
          open={deleteElectricNumberIndex !== -1}
          title={"刪除發電業電號欄位"}
          content={"是否確認要刪除發電業電號欄位？"}
          onConfirm={() => {
            remove(deleteElectricNumberIndex);
            setDeleteElectricNumberIndex(-1);
          }}
          onClose={() => {
            setDeleteElectricNumberIndex(-1);
          }}
        />
      ) : null}
    </>
  );
}
