import { Box, Card, Divider, Grid, Tooltip, Typography } from "@mui/material";
import { CompanyContract, RateType } from "@core/graphql/types";
import FlagIcon from "@mui/icons-material/OutlinedFlag";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { formatDateTime } from "@utils/format";
import InfoBox from "../InfoBox";
import { IconBtn } from "@components/Button";
import DownloadDocBox from "@components/DownloadDocBox";
import { useRemoveCompanyContract } from "@utils/hooks";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-toastify";
import { InputSearch } from "@components/Input";
import PowerPlantPanel from "@components/PowerPlant/PowerPlantPanel";
import AddPowerPlantBtn from "@components/PowerPlant/AddPowerPlantBtn";
import { useRouter } from "next/router";
import EditCompanyContractBtn from "@components/CompanyContract/CompanyContractDialog/EditCompanyContractBtn";
import MonthlyTransferDegreeChart from "@components/CompanyContract/MonthlyTransferDegreeChart";
import { useSearch } from "@utils/hooks/useSearch";
import InfoIcon from "@mui/icons-material/Info";
import { useCompanyContractMonthlyTransferDegrees } from "@utils/hooks/queries";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface CompanyContractCardProps {
  companyContract: CompanyContract;
}

const styles = {
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: "172px",
    marginTop: "10px",
  },
} as const;

const companyContractCardInfo = (companyContract: CompanyContract) => {
  const isSingleRate = companyContract.rateType === RateType.Single;
  const companyContractInfo = [
    {
      icon: MonetizationOnOutlinedIcon,
      label: "合約價格",
      content: isSingleRate ? companyContract.price : "各別費率",
      unit: isSingleRate ? "" : "元/kWh",
    },
    {
      icon: EventOutlinedIcon,
      label: "合約起始日期",
      content: formatDateTime(companyContract.startedAt),
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: "轉供率要求",
      content: companyContract.transferRate,
      unit: "%",
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: "正式轉供日",
      content: companyContract.officialTransferDate
        ? formatDateTime(companyContract.officialTransferDate)
        : "N/A",
    },
    {
      icon: CreditCardOutlinedIcon,
      label: "付款條件",
      content: companyContract.daysToPay,
      unit: "天",
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: "合約結束日期",
      content: formatDateTime(companyContract.endedAt),
    },
    {
      icon: AccessTimeOutlinedIcon,
      label: "合約年限",
      content: companyContract.duration,
      unit: "年",
    },
  ];

  return { companyContractInfo };
};

function CompanyContractCard(props: CompanyContractCardProps) {
  const { companyContract } = props;
  const router = useRouter();
  const { searchTerm, setInputValue, executeSearch } = useSearch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [year, setYear] = useState<Date>(new Date());

  const { data: monthlyTransferDegreeData, loading: monthlyTransferDegreeLoading } = useCompanyContractMonthlyTransferDegrees(
    companyContract.id, 
    `${year.getFullYear()}-01-01`, 
    `${year.getFullYear()}-12-31`,
  );
  /** TODO: 改成從 API 取得 */
  const degrees = 20;

  const [removeCompanyContract] = useRemoveCompanyContract();
  const { companyContractInfo } = companyContractCardInfo(companyContract);

  return (
    <>
      <Card sx={{ p: "36px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{`${companyContract.number}(${companyContract.name})`}</Typography>
          <Box sx={{ display: "flex" }}>
            <EditCompanyContractBtn companyContract={companyContract} />
            <IconBtn
              icon={<DeleteOutlined />}
              onClick={() => setOpenDeleteDialog(true)}
            />
          </Box>
        </Box>
        <Grid container sx={{ height: "264px" }}>
          <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
            <Box sx={{ display: "flex", columnGap: "12px" }}>
              <FlagIcon width="20px" />
              <Typography variant="body2">一年內待銷售度數</Typography>
            </Box>
            <Box sx={styles.box}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "40px",
                  columnGap: "4px",
                }}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  {degrees}
                </Typography>
                <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                  MWh/年
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            sm={4}
            sx={{
              padding: "36px",
              borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <Grid container sx={{ rowGap: "8px" }}>
              {companyContractInfo.map((c, index) => (
                <Grid item sm={6} key={`${c.label}-${index}`}>
                  <InfoBox
                    icon={c.icon}
                    label={c.label}
                    content={c.content}
                    unit={c.unit}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ margin: "36px 0" }} />

        <Box sx={{ display: "flex", height: "462px" }}>
          <Box
            sx={{
              paddingRight: "36px",
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              display: "flex",
              flexDirection: "column",
              rowGap: "6px",
              width: "800px",
            }}
          >
            <Box
              sx={{ display: "flex", columnGap: "4px", marginBottom: "4px" }}
            >
              <FolderOutlinedIcon />
              <Typography variant="body2">相關文件</Typography>
            </Box>
            <DownloadDocBox
              fileId={companyContract.contractDoc}
              label="購電合約"
              fileName={companyContract.contractDocName}
            />
            <DownloadDocBox
              fileId={companyContract.industryDoc}
              label="電業佐證資料"
              fileName={companyContract.industryDocName}
            />
            <DownloadDocBox
              fileId={companyContract.transferDoc}
              label="轉供所需資料"
              fileName={companyContract.transferDocName}
            />
          </Box>
          <Box
            sx={{
              paddingLeft: "36px",
              display: "flex",
              flexDirection: "column",
              rowGap: "6px",
              width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", columnGap: "4px", marginBottom: "4px" }}
            >
              <ArticleOutlinedIcon />
              <Typography variant="body2">合約描述 / 特殊條件</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "primary.light",
                borderRadius: "16px",
                width: "100%",
                height: "100%",
                padding: "16px 24px",
              }}
            >
              <Typography variant="body3">
                {companyContract.description}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ margin: "36px 0 " }} />
        <TransferDegreeChart
          name="月轉供量"
          data={monthlyTransferDegreeData?.companyContractMonthlyTransferDegrees?.monthlyTotals.map(x => x?.totalDegrees) ?? []}
          loading={monthlyTransferDegreeLoading}
          year={year}
          setYear={setYear}
        />
        <Divider sx={{ margin: "36px 0 " }} />

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "16px",
            }}
          >
            {/* 搜尋 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <InputSearch onChange={setInputValue} onEnter={executeSearch} />
              <Tooltip title="可使用電廠名稱或電號搜尋">
                <InfoIcon />
              </Tooltip>
            </Box>
            <AddPowerPlantBtn companyContract={companyContract} />
          </Box>
          <PowerPlantPanel
            companyContract={companyContract}
            searchTerm={searchTerm}
          />
        </Box>
      </Card>
      {openDeleteDialog ? (
        <DialogAlert
          open={openDeleteDialog}
          title={"刪除合約"}
          content={"是否確認要刪除合約？"}
          onConfirm={() => {
            removeCompanyContract({
              variables: { id: companyContract.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setOpenDeleteDialog(false);
                router.push("/industry");
              },
            });
          }}
          onClose={() => setOpenDeleteDialog(false)}
        />
      ) : null}
    </>
  );
}

export default CompanyContractCard;
