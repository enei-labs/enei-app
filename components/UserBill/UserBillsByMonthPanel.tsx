import { InputDate } from "@components/Input";
import Table, { Config } from "@components/Table/Table";
import { ElectricBillStatus, UserBillsByMonth } from "@core/graphql/types";
import { Box, Card, Typography } from "@mui/material";
import { formatDateTime } from "@utils/format";
import { useUserBillsByMonth } from "@utils/hooks/queries/useUserBillsByMonth";
import { useState } from "react";
import { useRouter } from "next/router";

export const UserBillsByMonthPanel = () => {
  const router = useRouter();
  const currentDate = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}`;
  };

  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: formatDateToString(oneYearAgo),
    endDate: formatDateToString(currentDate),
  });

  const { data, loading } = useUserBillsByMonth(
    dateRange.startDate,
    dateRange.endDate
  );

  const configs: Config<UserBillsByMonth>[] = [
    {
      header: "計費年月",
      accessor: "month",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() =>
            router.push(`/electric-bill/user-bill?month=${formatDateToString(new Date(rowData.month))}`)
          }
        >
          {formatDateTime(rowData.month, "yyyy-MM")}
        </Box>
      ),
    },
    {
      header: "電費單數量",
      accessor: "bills",
      render: (rowData) => <Box>{rowData.bills.length}</Box>,
    },
    {
      header: "狀態（未完成）",
      accessor: "bills",
      render: (rowData) => (
        <Box>
          {
            rowData.bills.filter(
              (bill) => bill.status === ElectricBillStatus.Draft
            ).length
          }
        </Box>
      ),
    },
    {
      header: "狀態（待審核）",
      accessor: "bills",
      render: (rowData) => (
        <Box>
          {
            rowData.bills.filter(
              (bill) => bill.status === ElectricBillStatus.Pending
            ).length
          }
        </Box>
      ),
    },
    {
      header: "狀態（已審核）",
      accessor: "bills",
      render: (rowData) => (
        <Box>
          {
            rowData.bills.filter(
              (bill) => bill.status === ElectricBillStatus.Approved
            ).length
          }
        </Box>
      ),
    },
    {
      header: "狀態（手動輸入）",
      accessor: "bills",
      render: (rowData) => (
        <Box>
          {
            rowData.bills.filter(
              (bill) => bill.status === ElectricBillStatus.Manual
            ).length
          }
        </Box>
      ),
    },
    {
      header: "來源（手動匯入）",
      accessor: "bills",
      render: (rowData) => (
        <Box>
          {
            rowData.bills.filter(
              (bill) => bill.billSource === 'MANUAL_IMPORT'
            ).length
          }
        </Box>
      ),
    },
  ];

  return (
    <Card sx={{ mt: "36px", p: "36px" }}>
      <Typography variant="h4">用戶電費單</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          my: "16px",
          gap: "12px", // 添加間距
        }}
      >
        <Box sx={{ display: "flex", gap: "12px" }}>
          <InputDate
            label="起始年月"
            value={dateRange.startDate}
            openTo="month"
            views={["year", "month"]}
            onChange={(newValue) => {
              if (newValue) {
                const dateObj = new Date(newValue);
                const formattedDate = formatDateToString(dateObj);
                setDateRange((prev) => ({
                  ...prev,
                  startDate: formattedDate,
                }));
              }
            }}
          />
          <InputDate
            label="結束年月"
            value={dateRange.endDate}
            openTo="month"
            views={["year", "month"]}
            onChange={(newValue) => {
              if (newValue) {
                const dateObj = new Date(newValue);
                const formattedDate = formatDateToString(dateObj);
                setDateRange((prev) => ({
                  ...prev,
                  endDate: formattedDate,
                }));
              }
            }}
          />
        </Box>
      </Box>
      <Table
        configs={configs}
        list={data?.userBillsByMonth}
        total={data?.userBillsByMonth?.length}
        loading={loading}
      />
    </Card>
  );
};
