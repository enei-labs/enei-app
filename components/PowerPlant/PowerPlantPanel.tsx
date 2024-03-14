import { Table } from "@components/Table";
import { usePowerPlants } from "@utils/hooks/queries";
import { PowerPlant } from "@core/graphql/types";
import { Config } from "../Table/Table";
import { IconBtn } from "@components/Button";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRemovePowerPlant } from "@utils/hooks/mutations/useRemovePowerPlant";
import { toast } from "react-toastify";

const PowerPlantDialog = dynamic(() => import("./PowerPlantDialog"));
const DialogAlert = dynamic(() => import("@components/DialogAlert"));

const PowerPlantPanel = ({
  companyContractId,
}: {
  companyContractId: string;
}) => {
  const { data, loading, refetch } = usePowerPlants({
    variables: { companyContractId },
  });
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedData, selectData] = useState<PowerPlant | null>(null);
  const [removePowerPlant] = useRemovePowerPlant();

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
      // render: (data) => {
      //   const f = data.annualPowerGeneration;
      //   return <div>test</div>;
      // },
    },
    {
      header: "年發電量（MWh）",
      accessor: "annualPowerGeneration",
    },
    {
      header: "電廠裝置容量(kWh)",
      accessor: "volume",
    },
    {
      header: "供電裝置容量(kWh)",
      accessor: "supplyVolume",
    },
    {
      header: "單位預估年發電量",
      accessor: "estimatedAnnualPowerGeneration",
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
      {openUpdateDialog && selectedData ? (
        <PowerPlantDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          variant="edit"
          defaultValues={selectedData}
          companyContractId={companyContractId}
        />
      ) : null}
      {openDeleteDialog && selectedData ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除電廠"}
          content={"是否確認要刪除電廠？"}
          onConfirm={() => {
            removePowerPlant({
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

export default PowerPlantPanel;
