import React from "react";
import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface TPCBillHeaderProps {
  variant: "create" | "edit";
  onClose: VoidFunction;
}

export function TPCBillHeader({ variant, onClose }: TPCBillHeaderProps) {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Typography variant="h4" textAlign="left">
        {variant === "create" ? "新增台電代輸繳費單" : "修改台電代輸繳費單"}
      </Typography>
      <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
    </Grid>
  );
}
