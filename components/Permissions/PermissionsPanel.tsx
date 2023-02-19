import { Table } from "@components/Table";
import { useCompanies } from "@utils/hooks/queries/useCompanies";
import { useAccounts } from "@utils/hooks/queries/useAccounts";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { IconBtn } from "@components/Button";

const PermissionsPanel = () => {
  const { data, loading, refetch } = useAccounts();

  const configs = [
    {
      header: "信箱",
      accessor: "email",
    },
    {
      header: "用戶名稱",
      accessor: "name",
    },
    {
      header: "公司名稱",
      accessor: "companyName",
    },
    {
      header: "權限",
      accessor: "role",
    },
    {
      header: "修改 / 刪除",
      render: () => (
        <>
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              // setIsOpenDialog(true);
            }}
          />
          <IconBtn
            icon={<DeleteOutlined />}
            onClick={() => {
              // setIsOpenDialog(true);
            }}
          />
        </>
      ),
    },
    {
      header: "發送密碼設定信件",
      render: () => (
        <IconBtn
          icon={<NearMeOutlinedIcon />}
          onClick={() => {
            // setIsOpenDialog(true);
          }}
        ></IconBtn>
      ),
    },
  ];

  return (
    <Table
      configs={configs}
      list={data?.accounts.list}
      total={data?.accounts.total}
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

export default PermissionsPanel;
