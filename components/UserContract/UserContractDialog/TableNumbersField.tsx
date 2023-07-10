import { InputNumber, InputText } from "@components/Input";
import { FormData } from "@components/UserContract/UserContractDialog/FormData";
import { Box, Button, Grid, Typography } from "@mui/material";
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

interface TableNumbersFieldProps {
  control: Control<any, any>;
  field: ControllerRenderProps<FormData, any>;
}

export function TableNumbersField(props: TableNumbersFieldProps) {
  const { field: rootField, control } = props;

  const [addTableNumber, setAddTableNumber] = useState<number>(1);
  const [deleteTableNumberIndex, setDeleteTableNumberIndex] =
    useState<number>(-1);

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  return (
    <>
      {fields.map((field, fieldIndex) => (
        <Controller
          key={field.id}
          control={control}
          name={`${rootField.name}.${fieldIndex}`}
          render={({ field }) => {
            return (
              <Box display={"flex"} columnGap="12px">
                <InputText
                  {...field}
                  label={`表號${fieldIndex + 1}`}
                  placeholder={"請填入"}
                  required
                />
                <IconBtn
                  icon={<CloseIcon />}
                  onClick={() => setDeleteTableNumberIndex(fieldIndex)}
                />
              </Box>
            );
          }}
        />
      ))}

      {/* 新增表號欄位 */}
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
            value={addTableNumber}
            onChange={(number: any) => {
              setAddTableNumber(number);
            }}
          ></InputNumber>
          <Typography variant="subtitle2">表號欄位</Typography>
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => {
              const emptyArray = [];
              for (let i = 1; i <= addTableNumber; i++) {
                emptyArray.push("");
              }

              append(emptyArray);
            }}
          >
            新增
          </Button>
        </Grid>
      </Grid>

      {deleteTableNumberIndex !== -1 ? (
        <DialogAlert
          open={deleteTableNumberIndex !== -1}
          title={"刪除表號"}
          content={"是否確認要刪除表號？"}
          onConfirm={() => {
            remove(deleteTableNumberIndex);
            setDeleteTableNumberIndex(-1);
          }}
          onClose={() => {
            setDeleteTableNumberIndex(-1);
          }}
        />
      ) : null}
    </>
  );
}
