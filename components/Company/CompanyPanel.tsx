import { Table } from "@components/Table";
import { Box, Typography } from "@mui/material";
import { useCompanies } from "@utils/hooks/queries";
import { Company } from "../../core/graphql/types";
import { Config } from "../Table/Table";

interface CompanyPanelProps {
  setCompanyFn: (company: Company) => void;
}

const CompanyPanel = (props: CompanyPanelProps) => {
  const { setCompanyFn } = props;
  const { data, loading, refetch } = useCompanies();

  const configs: Config<Company>[] = [
    {
      header: "公司名稱",
      accessor: "name",
      render: (rowData) => (
        <Box sx={{ cursor: "pointer" }} onClick={() => setCompanyFn(rowData)}>
          {rowData.name}
        </Box>
      ),
    },
    {
      header: "統一編號",
      accessor: "taxId",
    },
    {
      header: "聯絡人姓名",
      accessor: "contactName",
    },
    {
      header: "聯絡人電話",
      accessor: "contactPhone",
    },
    {
      header: "聯絡人信箱",
      accessor: "contactEmail",
    },
    {
      header: "裝置量",
    },
    {
      header: "修改刪除",
    },
  ];

  return (
    <Table
      configs={configs}
      list={data?.companies.list}
      total={data?.companies.total}
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

export default CompanyPanel;
