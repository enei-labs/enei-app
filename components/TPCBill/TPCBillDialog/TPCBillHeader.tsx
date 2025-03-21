import React from "react";
import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HelperText from "@components/HelperText";
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
      <HelperText>
        <ul style={{ textAlign: "left" }}>
          <li>
            請先至電費單匯出頁面新增用戶或發電業電費單組合，以確保系統能正確導入相關資料
          </li>
          <li>填寫轉供度數前，請先選擇轉供契約編號</li>
        </ul>
      </HelperText>
    </Grid>
  );
}
