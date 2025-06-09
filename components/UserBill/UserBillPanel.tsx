import { Table } from "@components/Table";
import { UserBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card, Tooltip } from "@mui/material";
import { useFee, useUserBills } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InfoIcon from "@mui/icons-material/Info";
import { IconBtn } from "@components/Button";
import { UserBillDialog } from "./UserBillDialog";
import { useState } from "react";
import { ReviewStatusLookup } from "@core/look-up/review-status";
import { useSearch } from "@utils/hooks/useSearch";
import { InputSearch } from "@components/Input";

interface UserBillPanelProps {
  month: string;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const { setInputValue, searchTerm, executeSearch } = useSearch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [userBill, setUserBill] = useState<UserBill | null>(null);
  const { data, loading, refetch } = useUserBills({
    month: props.month,
    term: searchTerm,
  });
  const { data: feeData, loading: feeLoading } = useFee();

  const configs: Config<UserBill>[] = [
    {
      header: "電費單名稱",
      accessor: "name",
      render: (rowData) => <Box>{rowData.name}</Box>,
    },
    {
      header: "狀態",
      accessor: "status",
      render: (rowData) => <Box>{ReviewStatusLookup[rowData.status]}</Box>,
    },
    {
      header: "檢視 / 審核",
      render: (data) => (
        <IconBtn
          icon={<EventNoteOutlinedIcon />}
          onClick={() => {
            setUserBill(data);
            setIsOpenDialog(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Card sx={{ mt: "36px", p: "36px" }}>
        <Typography variant="h4" sx={{ mb: "16px" }}>{`用戶電費單 - ${formatDateTime(
          props.month,
          "yyyy-MM"
        )}`}</Typography>
        
        {/* 搜尋 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
          <InputSearch onChange={setInputValue} onEnter={executeSearch} />
          <Tooltip title="可使用電費單名稱搜尋">
            <InfoIcon />
          </Tooltip>
        </Box>

        <Table
          configs={configs}
          list={data?.userBills?.list}
          total={data?.userBills?.total}
          loading={loading}
          onPageChange={(page) => {
            refetch({
              limit: page.rows,
              offset: page.rows * page.index,
            });
          }}
        />
      </Card>
      {userBill && feeData && (
        <UserBillDialog
          userBill={userBill}
          feeData={feeData.fee}
          isOpenDialog={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
        />
      )}
    </>
  );
};

export default UserBillPanel;
