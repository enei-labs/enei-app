import React from "react";
import { Typography } from "@mui/material";
import { FieldsController } from "@components/Controller";
import FieldConfig from "@core/types/fieldConfig";

interface DocumentFieldsProps {
  control: any;
  errors: any;
}

export default function DocumentFields({
  control,
  errors,
}: DocumentFieldsProps) {
  const docConfigs: FieldConfig[] = [
    {
      type: "FILE",
      name: "billDoc",
      label: "台電繳費單",
      required: true,
    },
  ];

  return (
    <>
      <Typography textAlign="left" variant="h5">
        相關文件
      </Typography>
      <FieldsController configs={docConfigs} form={{ control, errors }} />
    </>
  );
}
