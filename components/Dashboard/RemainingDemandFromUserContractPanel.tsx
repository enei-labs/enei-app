import { Table } from "@components/Table";
import { RemainingDemandFromUserContract } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Paper, Typography } from "@mui/material";

interface RemainingDemandFromUserContractProps {
  userContracts: RemainingDemandFromUserContract[];
  loading: boolean;
}

/** @TODO accessor */
const RemainingDemandFromUserContractPanel = (
  props: RemainingDemandFromUserContractProps
) => {
  const { userContracts, loading } = props;

  const configs: Config<RemainingDemandFromUserContract>[] = [
    {
      header: "合約名稱",
      accessor: "name",
    },
    {
      header: "用戶",
      // accessor: "serialNumber",
    },
    {
      header: "不足容量",
      accessor: "capacity",
    },
    {
      header: "預計開始不足日期",
      // accessor: "salesTo",
    },
  ];

  return (
    <Paper sx={{ width: "100%" }}>
      <Typography variant="h4">容量不足用戶名單</Typography>
      <Table
        configs={configs}
        list={userContracts}
        total={userContracts.length}
        loading={loading}
      />
    </Paper>
  );
};

export default RemainingDemandFromUserContractPanel;
