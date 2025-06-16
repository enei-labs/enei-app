import { Table } from "@components/Table";
import { Fee, Role, IndustryBillConfig } from "@core/graphql/types";
import { Config, Page } from "../Table/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import IndustryBillConfigDialog from "@components/IndustryBill/IndustryBillConfigDialog/IndustryBillConfigDialog";
import { useRemoveIndustryBillConfig } from "@utils/hooks/mutations/useRemoveIndustryBillConfig";
import { useIndustryBillConfigs } from "@utils/hooks/queries";
const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface IndustryBillConfigPanelProps {
  fee: Fee;
}

const IndustryBillConfigPanel = (props: IndustryBillConfigPanelProps) => {
  const { fee } = props;
  const { me } = useAuth();
  const router = useRouter();

  const { data, loading, refetch } = useIndustryBillConfigs();

  const [currentIndustryBillConfig, setCurrentIndustryBillConfig] =
    useState<IndustryBillConfig | null>(null);
  const [isOpenDialog, setOpenDownloadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [removeIndustryBillConfig] = useRemoveIndustryBillConfig();

  const configs: Config<IndustryBillConfig>[] = [
    {
      header: "電費單組合名稱",
      accessor: "name",
      render: (rowData) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => router.push(`/electric-bill/industry-bill-config/${rowData.id}?industryBillConfigName=${rowData.name}`)}
        >
          {rowData.name}
        </Box>
      ),
    },
    {
      header: "修改 / 刪除",
      render: (industryBillConfig) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              setCurrentIndustryBillConfig(industryBillConfig);
              setOpenUpdateDialog(true);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            disabled={!me || me.role === Role.User}
            icon={<DeleteOutlined />}
            onClick={() => {
              setCurrentIndustryBillConfig(industryBillConfig);
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
        list={data?.industryBillConfigs?.list}
        total={data?.industryBillConfigs?.total}
        loading={loading}
        onPageChange={(page: any) =>
          refetch({
            limit: page.rows,
            offset: page.rows * page.index,
          })
        }
      />

      {/* {currentIndustryBillConfig && currentIndustryBillConfig ? (
        <IndustryBillDownloadDialog
          fee={fee}
          industryBillConfig={currentIndustryBillConfig}
          isOpenDialog={isOpenDialog}
          onClose={() => setOpenDownloadDialog(false)}
        />
      ) : null} */}

      {openUpdateDialog && currentIndustryBillConfig ? (
        <IndustryBillConfigDialog
          isOpenDialog={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          variant="edit"
          currentModifyIndustryBillConfig={currentIndustryBillConfig}
        />
      ) : null}

      {openDeleteDialog && currentIndustryBillConfig ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除電費單組合"}
          content={"是否確認要刪除電費單組合？"}
          onConfirm={() => {
            removeIndustryBillConfig({
              variables: { id: currentIndustryBillConfig.id },
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

export default IndustryBillConfigPanel;
