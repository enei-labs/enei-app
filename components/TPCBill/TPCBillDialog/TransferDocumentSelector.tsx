import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography } from "@mui/material";
import { InputAutocomplete } from "@components/Input";
import { FormData } from "@components/TPCBill/TPCBillDialog/FormData";

interface TransferDocumentSelectorProps {
  getTransferDocument: (options: any) => void;
  transferDocumentsData?: {
    transferDocuments: {
      list: { id: string; number?: string; name: string }[];
    };
  };
  reset: any;
}

export default function TransferDocumentSelector({
  getTransferDocument,
  transferDocumentsData,
  reset,
}: TransferDocumentSelectorProps) {
  const { control } = useFormContext<FormData>();
  return (
    <>
      <Typography variant="h5" textAlign="left">
        代輸繳費單資料
      </Typography>
      <Controller
        control={control}
        name="transferDocument"
        render={({ field }) => (
          <InputAutocomplete
            {...field}
            onChange={(value) => {
              field.onChange(value);
              if (value?.value) {
                getTransferDocument({ variables: { id: value.value } });
              }

              if (value === null) {
                reset();
              }
            }}
            options={
              transferDocumentsData?.transferDocuments.list.map((o) => ({
                label: `${o.number ?? ""}(${o.name})`,
                value: o.id,
              })) ?? []
            }
            label="轉供契約編號"
            placeholder="請填入"
            required
          />
        )}
      />
    </>
  );
}
