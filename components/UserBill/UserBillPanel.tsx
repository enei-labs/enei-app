import { Table } from "@components/Table";
import { Fee, UserBill } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Box } from "@mui/material";
import { useUserBills } from "@utils/hooks/queries";

interface UserBillPanelProps {
  fee: Fee;
}

const UserBillPanel = (props: UserBillPanelProps) => {
  const { data, loading, refetch } = useUserBills();

  const configs: Config<UserBill>[] = [
    {
      header: "電費單名稱",
      accessor: "name",
      render: (rowData) => <Box>{rowData.name}</Box>,
    },
  ];

  return (
    <>
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
    </>
  );
};

export default UserBillPanel;
