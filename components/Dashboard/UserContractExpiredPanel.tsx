import { Table } from "@components/Table";
import { UserContract } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Paper, Typography } from "@mui/material";
import { formatDateTime } from "@utils/format";

interface UserContractExpiredPanelProps {
  userContracts: UserContract[];
  loading: boolean;
}

const UserContractExpiredPanel = (props: UserContractExpiredPanelProps) => {
  const { userContracts, loading } = props;

  const configs: Config<UserContract>[] = [
    {
      header: "用戶名稱",
      render: (data) => <>{data.user?.name ?? ""}</>,
    },
    {
      header: "契約編號",
      accessor: "serialNumber",
    },
    {
      header: "契約起始日期",
      accessor: "salesAt",
      render: (data) => <>{formatDateTime(data.salesAt)}</>,
    },
    {
      header: "契約結束日期",
      accessor: "salesTo",
      render: (data) => <>{formatDateTime(data.salesTo)}</>,
    },
  ];

  return (
    <Paper sx={{ width: "100%" }}>
      <Typography variant="h4">未來一年用戶合約到期名單</Typography>
      <Table
        configs={configs}
        list={userContracts}
        total={userContracts.length}
        loading={loading}
      />
    </Paper>
  );
};

export default UserContractExpiredPanel;
