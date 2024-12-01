import { IconBtn } from "@components/Button";
import { TransferDocument } from "@core/graphql/types";
import { Box, Card, Typography, Grid, Divider } from "@mui/material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRemoveTransferDocument } from "@utils/hooks";
import { toast } from "react-toastify";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import TransferDocumentPowerPlant from "./TransferDocumentPowerPlant";
import TransferDocumentUsers from "./TransferDocumentUsers";
import ProgressBar from "@components/TransferDocument/TransferDocumentCard/ProgressBar";
import DownloadDocBox from "@components/DownloadDocBox";
import TPCPanel from "@components/TPCBill/TPCPanel";
import TransferDocumentInfoBox from "@components/TransferDocument/TransferDocumentInfoBox";
import { useTpcBills } from "@utils/hooks/queries";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));
const TransferDocumentDialog = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/TransferDocumentDialog"
    )
);

interface TransferDocumentProps {
  transferDocument: TransferDocument;
}

function TransferDocumentCard(props: TransferDocumentProps) {
  const { transferDocument } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [removeTransferDocument] = useRemoveTransferDocument();

  const { data, loading } = useTpcBills({
    transferDocumentId: transferDocument.id,
    offset: 0,
    limit: 1000,
  });

  console.log("transferDocument-->\n", transferDocument, data);

  return (
    <>
      <Card sx={{ p: "36px", maxWidth: "1208px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 0 32px 0",
          }}
        >
          <Typography variant="h4">{`${
            transferDocument.number ?? "轉供契約申請中"
          }(${transferDocument.name})`}</Typography>
          <Box sx={{ display: "flex" }}>
            <IconBtn
              icon={<DriveFileRenameOutlineOutlinedIcon />}
              onClick={() => setOpenEditDialog(true)}
            />
            <IconBtn
              icon={<DeleteOutlined />}
              onClick={() => setOpenDeleteDialog(true)}
            />
          </Box>
        </Box>
        <Typography sx={{ margin: "0 0 24px 0" }} variant="h5">
          {`轉供組合 ${transferDocument.transferDocumentPowerPlants.length} 轉 ${transferDocument.transferDocumentUsers.length}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TransferDocumentPowerPlant
              transferDocumentPowerPlants={
                transferDocument.transferDocumentPowerPlants
              }
            />
          </Grid>
          <Grid item xs={8}>
            <TransferDocumentUsers
              transferDocumentUsers={transferDocument.transferDocumentUsers}
            />
          </Grid>
        </Grid>

        <Divider sx={{ margin: "36px 0" }} />

        <ProgressBar transferDocument={transferDocument} />

        <Divider sx={{ margin: "36px 0" }} />

        <Box sx={{ display: "flex", height: "462px" }}>
          <Box
            sx={{
              paddingRight: "36px",
              display: "flex",
              flexDirection: "column",
              rowGap: "6px",
              width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", columnGap: "4px", marginBottom: "4px" }}
            >
              <Typography variant="h5">相關文件</Typography>
            </Box>
            <DownloadDocBox fileId={""} label="轉供計畫書用印版" />
            <DownloadDocBox fileId={""} label="轉供函覆文" />
            <DownloadDocBox fileId={""} label="轉供契約Word版" />
            <DownloadDocBox fileId={""} label="正式轉供契約" />
            <DownloadDocBox fileId={""} label="匯出電能轉供契約草稿" />
          </Box>
        </Box>
      </Card>

      <Divider sx={{ margin: "36px 0" }} />

      <Grid container spacing={4} maxWidth={"1280px"}>
        <Grid item sm={6}>
          <Card sx={{ p: "36px" }}>
            <Typography variant="h4">台電代輸繳費單</Typography>
            <TPCPanel
              transferDocumentId={transferDocument.id}
              loading={loading}
              tpcBillPage={data?.tpcBills}
            />
          </Card>
        </Grid>
        <Grid item sm={6}>
          <Card sx={{ p: "36px" }}>
            <Typography variant="h4">容量剩餘發電業名單</Typography>
            <TransferDocumentInfoBox
              transferDocument={transferDocument}
              loading={loading}
              tpcBillPage={data?.tpcBills}
            />
          </Card>
        </Grid>
      </Grid>
      {openDeleteDialog ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除轉供合約"}
          content={"是否確認要刪除轉供合約？"}
          onConfirm={() => {
            removeTransferDocument({
              variables: { id: transferDocument.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
              },
            });
          }}
          onClose={() => {
            setOpenDeleteDialog(false);
          }}
        />
      ) : null}
      {openEditDialog ? (
        <TransferDocumentDialog
          currentModifyTransferDocument={transferDocument}
          isOpenDialog={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          variant="edit"
        />
      ) : null}
    </>
  );
}

export default TransferDocumentCard;
