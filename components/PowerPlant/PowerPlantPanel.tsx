import { Table } from "@components/Table";
import { usePowerPlants } from "@utils/hooks/queries";
import { PowerPlant } from "@core/graphql/types";
import { Config } from "../Table/Table";

const PowerPlantPanel = () => {
  const { data, loading, refetch } = usePowerPlants();

  const configs: Config<PowerPlant>[] = [
    {
      header: "電廠名稱",
      accessor: "name",
    },
    {
      header: "電號",
      accessor: "number",
    },
    {
      header: "尚未銷售度數",
      // accessor: "contactName",
    },
    {
      header: "年發電量",
      accessor: "annualPowerGeneration",
    },
    {
      header: "裝置容量",
      accessor: "capacity",
    },
    {
      header: "單位預估年發電量",
      accessor: "predictAnnualPowerGeneration",
    },
    {
      header: "轉供比例",
      accessor: "transferRate",
    },
    {
      header: "地址",
      accessor: "address",
    },
    {
      header: "修改 / 刪除",
    },
  ];

  return (
    <Table
      configs={configs}
      list={data?.powerPlants.list}
      total={data?.powerPlants.total}
      loading={loading}
      onPageChange={(page) =>
        refetch({
          limit: page.rows,
          offset: page.rows * page.index,
        })
      }
    />
  );
};

export default PowerPlantPanel;
