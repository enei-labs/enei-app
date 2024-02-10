import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import { FormData } from "./FormData";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import {
  Control,
  Controller,
  ControllerRenderProps,
  useFieldArray,
} from "react-hook-form";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useState } from "react";
import { IconBtn } from "@components/Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DialogAlert from "@components/DialogAlert";
import { useUserContracts } from "@utils/hooks/queries";
import { ElectricNumberInfo } from "@core/graphql/types";

interface ElectricNumbersFieldProps {
  control: Control<any, any>;
  field: ControllerRenderProps<FormData, any>;
  userId: string;
}

export function ElectricNumbersField(props: ElectricNumbersFieldProps) {
  const { field: rootField, control, userId } = props;

  const { data, loading } = useUserContracts({
    variables: { userId },
  });

  const [addElectricNumber, setAddElectricNumber] = useState<number>(1);
  const [deleteElectricNumberIndex, setDeleteElectricNumberIndex] =
    useState<number>(-1);

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  if (loading) return <CircularProgress size="24px" />;

  const flattenElectricNumberOptions =
    data?.userContracts.list.reduce((agg: ElectricNumberInfo[], curr) => {
      if (!curr.electricNumberInfos || !curr.electricNumberInfos.length)
        return agg;
      return [...agg, ...curr.electricNumberInfos];
    }, [] as ElectricNumberInfo[]) ?? [];

  return (
    <>
      {fields.map((field, fieldIndex) => (
        <Box display={"flex"} key={field.id} columnGap="12px">
          <Controller
            control={control}
            name={`${rootField.name}.${fieldIndex}.number`}
            render={({ field }) => {
              return (
                <InputAutocomplete
                  {...field}
                  onChange={(e) => field.onChange(e)}
                  options={
                    flattenElectricNumberOptions.map((o) => ({
                      label: o.number,
                      value: o.number,
                    })) ?? []
                  }
                  label={`用戶電號${fieldIndex + 1}`}
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
                <InputText disabled {...field} label={`採購電價（元/kWh）`} />
              );
            }}
          />
          <IconBtn
            icon={<CloseIcon />}
            onClick={() => setDeleteElectricNumberIndex(fieldIndex)}
          />
        </Box>
      ))}

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
          <Typography variant="subtitle2">個用戶電號欄位</Typography>
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => {
              const emptyArray = [];
              for (let i = 1; i <= addElectricNumber; i++) {
                emptyArray.push({
                  number: "",
                  price: 0,
                });
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
          title={"刪除用戶電號欄位"}
          content={"是否確認要刪除用戶電號欄位？"}
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
