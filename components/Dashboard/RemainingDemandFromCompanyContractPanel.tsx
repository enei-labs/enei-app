import { Table } from "@components/Table";
import { RemainingDemandFromCompanyContract } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { Paper, Typography } from "@mui/material";

interface RemainingDemandFromCompanyContractProps {
  companyContracts: RemainingDemandFromCompanyContract[];
  loading: boolean;
}

/** @TODO accessor */
const RemainingDemandFromCompanyContractPanel = (
  props: RemainingDemandFromCompanyContractProps
) => {
  const { companyContracts, loading } = props;

  const configs: Config<RemainingDemandFromCompanyContract>[] = [
    {
      header: "合約名稱",
      accessor: "name",
    },
    {
      header: "發電業",
      // accessor: "serialNumber",
    },
    {
      header: "剩餘容量",
      accessor: "capacity",
    },
    {
      header: "預計開始剩餘日期",
      // accessor: "salesTo",
    },
  ];

  return (
    <Paper sx={{ width: "100%" }}>
      <Typography variant="h4">容量剩餘發電業名單</Typography>
      <Table
        configs={configs}
        list={companyContracts}
        total={companyContracts.length}
        loading={loading}
      />
    </Paper>
  );
};

export default RemainingDemandFromCompanyContractPanel;
