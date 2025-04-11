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
import { useEffect, useMemo, useState } from "react";
import { IconBtn } from "@components/Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DialogAlert from "@components/DialogAlert";
import { useCompanyContracts } from "@utils/hooks/queries";
import { IndustryBillConfig, PowerPlant } from "@core/graphql/types";

interface ElectricNumbersFieldProps {
  control: Control<any, any>;
  field: ControllerRenderProps<FormData, any>;
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

  const [addElectricNumber, setAddElectricNumber] = useState<number>(1);
  const [deleteElectricNumberIndex, setDeleteElectricNumberIndex] =
    useState<number>(-1);

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  const formData = useWatch({ control, name: rootField?.name });

  const priceMap = useMemo(() => new Map(), []);

  const flattenPowerPlants = useMemo(() => {
    if (loading) return [];
    return (
      data?.companyContracts.list.reduce((agg: PowerPlant[], curr) => {
        if (!curr.powerPlants || !curr.powerPlants.length) return agg;
        curr.powerPlants.forEach((info) => {
          priceMap.set(info.id, curr.price);
        });
        return [...agg, ...curr.powerPlants];
      }, [] as PowerPlant[]) ?? []
    );
  }, [data, loading, priceMap]);

  useEffect(() => {
    if (
      !loading &&
      data &&
      currentModifyIndustryBillConfig?.electricNumbers?.length &&
      flattenPowerPlants.length
    ) {
      const initialValues = currentModifyIndustryBillConfig.electricNumbers
        .map((number) => {
          // 查找對應的電廠信息
          const powerPlant = flattenPowerPlants.find((p) => p.id === number);

          if (powerPlant) {
            return {
              number: {
                label: `${powerPlant.number} ${powerPlant.name}`,
                value: powerPlant.id,
              },
              price: priceMap.get(powerPlant.id) || 0,
            };
          }
          return null;
        })
        .filter(Boolean);

      // 使用 useFieldArray 的 replace 方法設置初始值
      if (initialValues.length > 0) {
        remove(0); // 清空現有欄位
        append(initialValues); // 添加初始值
      }
    }
  }, [
    loading,
    data,
    currentModifyIndustryBillConfig,
    flattenPowerPlants,
    append,
    remove,
    priceMap,
  ]);

  if (loading) return <CircularProgress size="24px" />;

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

        // Get the current config electric number if available
        const currentElectricNumber =
          currentModifyIndustryBillConfig?.electricNumbers?.[fieldIndex];

        return (
          <Box display={"flex"} key={field.id} columnGap="12px">
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.number`}
              render={({ field }) => {
                return (
                  <InputAutocomplete
                    sx={{ width: "70%" }}
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    options={
                      flattenPowerPlants.map((o) => {
                        // Match existing values from currentModifyIndustryBillConfig if available
                        const isSelected = currentElectricNumber === o.number;
                        return {
                          label: `${o.number} ${o.name}`,
                          value: isSelected ? currentElectricNumber : o.id,
                          disabled: selectedNumbers.includes(o.id),
                        };
                      }) ?? []
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
                    sx={{ width: "30%" }}
                    disabled
                    {...field}
                    label={`費率（元/kWh）`}
                    value={
                      priceMap.get(formData?.[fieldIndex]?.number?.value) ?? 0
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
