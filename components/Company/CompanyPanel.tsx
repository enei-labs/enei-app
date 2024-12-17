import { Table } from "@components/Table";
import { Box } from "@mui/material";
import { useCompanies } from "@utils/hooks/queries";
import { Company } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { IconBtn } from "@components/Button";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import { useRemoveCompany } from "@utils/hooks";
import DialogAlert from "@components/DialogAlert";
import { toast } from "react-toastify";
import CompanyDialog from "@components/Company/CompanyDialog";

interface CompanyPanelProps {
  setCompanyFn: (company: Company) => void;
  searchTerm?: string;
}

const CompanyPanel = (props: CompanyPanelProps) => {
  const { setCompanyFn, searchTerm } = props;
  const { data, loading, refetch } = useCompanies({
    variables: { term: searchTerm },
  });
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedData, selectData] = useState<Company | null>(null);
  const [removeCompany] = useRemoveCompany();

  const configs: Config<Company>[] = [
    {
      header: "公司名稱",
      accessor: "name",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => setCompanyFn(rowData)}
        >
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
      header: "總裝置量(MW)",
      accessor: "totalVolume",
    },
    {
      header: "修改 / 刪除",
      render: (data) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              selectData(data);
              setOpenUpdateDialog(true);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            icon={<DeleteOutlined />}
            onClick={() => {
              selectData(data);
              setOpenDeleteDialog(true);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
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
      {openUpdateDialog && selectedData ? (
        <CompanyDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          variant="edit"
          defaultValues={selectedData}
        />
      ) : null}
      {openDeleteDialog && selectedData ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除公司"}
          content={"是否確認要刪除公司？"}
          onConfirm={() => {
            removeCompany({
              variables: { id: selectedData.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
              },
            });
          }}
          onClose={() => setOpenDeleteDialog(false)}
        />
      ) : null}
    </>
  );
};

export default CompanyPanel;
