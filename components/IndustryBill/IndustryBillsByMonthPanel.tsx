import { InputDate } from "@components/Input";
import Table, { Config } from "@components/Table/Table";
import { ElectricBillStatus, IndustryBillsByMonth } from "@core/graphql/types";
import { Box, Card, Typography, IconButton, Tooltip, Badge } from "@mui/material";
import { formatDateTime } from "@utils/format";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIndustryBillsByMonth } from "@utils/hooks/queries/useIndustryBillsByMonth";
import EmailIcon from "@mui/icons-material/Email";
import { IndustryBillEmailModal } from "./IndustryBillEmailModal";

export const IndustryBillsByMonthPanel = () => {
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

  const [emailModalState, setEmailModalState] = useState<{
    open: boolean;
    month: string;
  }>({
    open: false,
    month: "",
  });

  const { data, loading } = useIndustryBillsByMonth(
    dateRange.startDate,
    dateRange.endDate
  );

  const configs: Config<IndustryBillsByMonth>[] = [
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
            router.push(`/electric-bill/industry-bill?month=${formatDateToString(new Date(rowData.month))}`)
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
      header: "狀態（已拒絕）",
      accessor: "bills",
      render: (rowData) => (
        <Box>
          {
            rowData.bills.filter(
              (bill) => bill.status === ElectricBillStatus.Rejected
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
    {
      header: "寄信",
      accessor: "bills",
      render: (rowData) => {
        const approvedCount = rowData.bills.filter(
          (bill) => bill.status === ElectricBillStatus.Approved
        ).length;
        const totalCount = rowData.bills.length;
        const allApproved = approvedCount === totalCount && totalCount > 0;

        return (
          <Tooltip
            title={allApproved ? "寄送電費單" : `尚有 ${totalCount - approvedCount} 筆未審核`}
          >
            <span>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setEmailModalState({
                    open: true,
                    month: formatDateTime(rowData.month, "yyyy-MM"),
                  });
                }}
                disabled={totalCount === 0}
                color={allApproved ? "primary" : "default"}
              >
                <Badge
                  badgeContent={totalCount - approvedCount}
                  color="error"
                  invisible={allApproved || totalCount === 0}
                >
                  <EmailIcon />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Card sx={{ mt: "36px", p: "36px" }}>
      <Typography variant="h4">發電業電費單</Typography>
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
        list={data?.industryBillsByMonth}
        total={data?.industryBillsByMonth?.length}
        loading={loading}
      />
      {emailModalState.open && (
        <IndustryBillEmailModal
          open={emailModalState.open}
          onClose={() => setEmailModalState({ open: false, month: "" })}
          month={emailModalState.month}
        />
      )}
    </Card>
  );
};
