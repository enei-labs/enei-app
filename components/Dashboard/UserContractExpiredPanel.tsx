import { Table } from "@components/Table";
import { UserContract } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Paper, Typography } from "@mui/material";

interface UserContractExpiredPanelProps {
  userContracts: UserContract[];
  loading: boolean;
}

const UserContractExpiredPanel = (props: UserContractExpiredPanelProps) => {
  const { userContracts, loading } = props;

  const configs: Config<UserContract>[] = [
    {
      header: "契約名稱",
      accessor: "name",
    },
    {
      header: "契約編號",
      accessor: "serialNumber",
    },
    {
      header: "契約生效日期",
      accessor: "salesAt",
    },
    {
      header: "契約失效日期",
      accessor: "salesTo",
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
