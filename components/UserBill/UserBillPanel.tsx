import { Table } from "@components/Table";
import { Fee, UserBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box, Typography, Card } from "@mui/material";
import { useUserBills } from "@utils/hooks/queries";
import { formatDateTime } from "@utils/format";
interface UserBillPanelProps {
  month: string;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const { data, loading, refetch } = useUserBills({
    month: props.month,
  });

  const configs: Config<UserBill>[] = [
    {
      header: "電費單名稱",
      accessor: "name",
      render: (rowData) => <Box>{rowData.name}</Box>,
    },
    {
      header: "狀態",
      accessor: "status",
      render: (rowData) => <Box>{rowData.status}</Box>,
    },
  ];

  return (
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
  );
};

export default UserBillPanel;
