import { useMemo, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import InputAutocomplete from "@components/Input/InputAutocomplete";
import InputText from "@components/Input/InputText";
import InputNumber from "@components/Input/InputNumber";
import Chip from "@components/Chip";
import DialogAlert from "@components/DialogAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

interface PowerPlantsSectionProps {
  control: any;
  watch: any;
  fields: any[];
  append: (data: any) => void;
  remove: (index: number) => void;
  companiesData: any;
  addPowerPlantNumber: number;
  setAddPowerPlantNumber: (num: number) => void;
}

const PowerPlantsSection = ({
  control,
  watch,
  fields,
  append,
  remove,
  companiesData,
  addPowerPlantNumber,
  setAddPowerPlantNumber,
}: PowerPlantsSectionProps) => {
  // 內部管理被選取的電廠與刪除索引
  const [selectedIndex, setSelectedIndex] = useState<number>(
    fields.length ? 0 : -1
  );
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  // 依據選取的電廠，利用 watch 取得目前設定值
  const currentCompany = watch(
    `transferDocumentPowerPlants.${selectedIndex}.company`
  );
  const currentCompanyContract = watch(
    `transferDocumentPowerPlants.${selectedIndex}.companyContract`
  );
  const currentPowerPlant = watch(
    `transferDocumentPowerPlants.${selectedIndex}.powerPlant`
  );

  const currentCompanyInfo = useMemo(() => {
    return (
      companiesData?.companies.list.find(
        (c: any) => c.id === currentCompany?.value
      ) || null
    );
  }, [companiesData, currentCompany]);

  const currentCompanyContractInfo = useMemo(() => {
    return (
      currentCompanyInfo?.companyContracts.find(
        (cc: any) => cc.id === currentCompanyContract?.value
      ) || null
    );
  }, [currentCompanyInfo, currentCompanyContract]);

  const powerPlants = useMemo(() => {
    return (
      companiesData?.companies.list?.flatMap((c: any) =>
        c.companyContracts?.flatMap((cc: any) => cc.powerPlants)
      ) || []
    );
  }, [companiesData]);

  const currentPowerPlantInfo = useMemo(() => {
    const powerPlant = powerPlants.find(
      (p: any) => p.id === currentPowerPlant?.value
    );
    return {
      number: powerPlant?.number || "N/A",
      volume: powerPlant ? powerPlant.volume / 1000 : "N/A",
      estimatedAnnualPowerGeneration:
        powerPlant?.estimatedAnnualPowerGeneration || 0,
    };
  }, [powerPlants, currentPowerPlant]);

  const transferRate =
    watch(`transferDocumentPowerPlants.${selectedIndex}.transferRate`) || 0;

  return (
    <>
      <Typography variant="h5" textAlign="left">
        電廠
      </Typography>
      <Box display="flex" flexDirection="column" rowGap="24px">
        {/* Chip 列表 */}
        <Box display="flex" gap="8px" flexWrap="wrap">
          {fields.map((item, index) => (
            <Chip
              key={item.id}
              label={`電廠${index + 1}`}
              aria-label={`電廠${index + 1}`}
              handleClick={() => setSelectedIndex(index)}
              handleDelete={() => setDeleteIndex(index)}
              selected={selectedIndex === index}
            />
          ))}
        </Box>
        {/* 詳細欄位 */}
        {fields.map((x, index) => (
          <Box
            key={x.id}
            display="flex"
            flexDirection="column"
            rowGap="24px"
            sx={selectedIndex !== index ? { display: "none" } : {}}
          >
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${index}.company`}
              render={({ field }) => (
                <InputAutocomplete
                  {...field}
                  onChange={(e: any) => field.onChange(e)}
                  options={
                    companiesData?.companies.list.map((o: any) => ({
                      label: o.name,
                      value: o.id,
                    })) || []
                  }
                  label={`公司${index + 1}名稱`}
                  aria-label={`公司${index + 1}名稱`}
                  placeholder="請填入"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${index}.companyContract`}
              render={({ field }) => (
                <InputAutocomplete
                  {...field}
                  disabled={!currentCompanyInfo}
                  onChange={(e: any) => field.onChange(e)}
                  options={
                    currentCompanyInfo?.companyContracts?.map((o: any) => ({
                      label: `${o.name}(${o.number})`,
                      value: o.id,
                    })) || []
                  }
                  label={`公司合約${index + 1}名稱`}
                  aria-label={`公司合約${index + 1}名稱`}
                  placeholder="請填入"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${index}.powerPlant`}
              render={({ field }) => (
                <InputAutocomplete
                  {...field}
                  disabled={!currentCompanyContractInfo}
                  onChange={(e: any) => field.onChange(e)}
                  options={
                    currentCompanyContractInfo?.powerPlants?.map((o: any) => ({
                      label: o.name,
                      value: o.id,
                    })) || []
                  }
                  label={`電廠${index + 1}名稱`}
                  aria-label={`電廠${index + 1}名稱`}
                  placeholder="請填入"
                  required
                />
              )}
            />
            <InputText
              label="電號"
              value={currentPowerPlantInfo.number}
              disabled
            />
            <InputText
              label="裝置容量（kW）"
              value={currentPowerPlantInfo.volume}
              disabled
            />
            <InputText
              label="預計年發電量（kWh）"
              value={new Intl.NumberFormat().format(
                currentPowerPlantInfo.volume !== "N/A"
                  ? (Number(currentPowerPlantInfo.volume) *
                      currentPowerPlantInfo.estimatedAnnualPowerGeneration) /
                      100
                  : 0
              )}
              disabled
            />
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${index}.transferRate`}
              rules={{ max: 100, min: 0 }}
              render={({ field }) => (
                <InputText
                  {...field}
                  label={`轉供比例（%）`}
                  aria-label={`轉供比例（%）`}
                  placeholder="請填入"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${index}.estimateAnnualSupply`}
              render={({ field }) => (
                <InputText
                  {...field}
                  label={`預計年供電度數（kWh）`}
                  aria-label={`預計年供電度數（kWh）`}
                  placeholder="請填入"
                  disabled
                  value={new Intl.NumberFormat().format(
                    ((currentPowerPlantInfo.volume !== "N/A"
                      ? Number(currentPowerPlantInfo.volume)
                      : 0) *
                      currentPowerPlantInfo.estimatedAnnualPowerGeneration *
                      transferRate) /
                      10000
                  )}
                />
              )}
            />
          </Box>
        ))}
      </Box>
      {/* 新增電廠欄位 */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        flexWrap="nowrap"
        padding="8px 16px"
        border="2px dashed #B2DFDB"
        borderRadius="16px"
      >
        <Grid container flexWrap="nowrap" alignItems="center" gap="8px">
          <Typography variant="subtitle2">新增</Typography>
          <InputNumber
            sx={{ width: "74px" }}
            value={addPowerPlantNumber}
            onChange={(number: any) =>
              number > 0 && setAddPowerPlantNumber(number)
            }
          />
          <Typography variant="subtitle2">電廠欄位</Typography>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => {
              const emptyPowerPlantInput = {
                estimateAnnualSupply: 0,
                company: { label: "", value: "" },
                companyContract: { label: "", value: "" },
                powerPlant: { label: "", value: "" },
                transferRate: 0,
              };
              const emptyArray = [];
              for (let i = 1; i <= addPowerPlantNumber; i++) {
                emptyArray.push(emptyPowerPlantInput);
              }
              append(emptyArray);
              if (!fields.length) {
                setSelectedIndex(0);
              }
            }}
          >
            新增
          </Button>
        </Grid>
      </Grid>
      {deleteIndex !== -1 && (
        <DialogAlert
          open={deleteIndex !== -1}
          title="刪除電廠"
          content="是否確認要刪除電廠？"
          onConfirm={() => {
            remove(deleteIndex);
            setDeleteIndex(-1);
          }}
          onClose={() => {
            setDeleteIndex(-1);
          }}
        />
      )}
    </>
  );
};

export default PowerPlantsSection;
