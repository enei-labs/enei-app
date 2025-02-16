import React from "react";
import { Controller } from "react-hook-form";
import { Typography } from "@mui/material";
import { InputAutocomplete } from "@components/Input";

interface TransferDocumentSelectorProps {
  control: any; // 可根據實際型別調整
  getTransferDocument: (options: any) => void;
  transferDocumentsData?: {
    transferDocuments: {
      list: { id: string; number?: string; name: string }[];
    };
  };
  reset: any;
}

export default function TransferDocumentSelector({
  control,
  getTransferDocument,
  transferDocumentsData,
  reset,
}: TransferDocumentSelectorProps) {
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
            onChange={(e, newValue) => {
              field.onChange(e);
              if (e?.value) {
                getTransferDocument({ variables: { id: e.value } });
              }

              if (e === null) {
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
