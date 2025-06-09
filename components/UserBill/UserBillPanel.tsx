import { Table } from "@components/Table";
import { UserBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card } from "@mui/material";
import { useFee, useUserBills } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { IconBtn } from "@components/Button";
import { UserBillDialog } from "./UserBillDialog";
import { useState } from "react";
import { ReviewStatusLookup } from "@core/look-up/review-status";
interface UserBillPanelProps {
  month: string;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [userBill, setUserBill] = useState<UserBill | null>(null);
  const { data, loading, refetch } = useUserBills({
    month: props.month,
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
        <Typography variant="h4">{`用戶電費單 - ${formatDateTime(
          props.month,
          "yyyy-MM"
        )}`}</Typography>
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
