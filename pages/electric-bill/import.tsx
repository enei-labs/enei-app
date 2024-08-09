import { AuthLayout } from "@components/Layout";
import { ReadExcelInput } from "@components/ReadExcelInput";
import { Card, Typography } from "@mui/material";
import { ReactElement } from "react";

function UserBillElectricImportPage() {
  return (
    <Card sx={{ padding: 2 }}>
      <Typography variant="h4" color="#000">
        電費匯入
      </Typography>
      <ReadExcelInput />
    </Card>
  );
}

UserBillElectricImportPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserBillElectricImportPage;
