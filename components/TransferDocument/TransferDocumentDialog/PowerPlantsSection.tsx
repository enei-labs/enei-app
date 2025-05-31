import { useMemo, useState, useCallback } from "react";
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
  // 管理電廠選取與刪除索引
  const [selectedIndex, setSelectedIndex] = useState<number>(
    fields.length ? 0 : -1
  );
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  // 取得目前選取電廠的相關資訊
  const currentCompany = watch(
    `transferDocumentPowerPlants.${selectedIndex}.company`
  );
  const currentCompanyContract = watch(
    `transferDocumentPowerPlants.${selectedIndex}.companyContract`
  );
  const currentPowerPlant = watch(
    `transferDocumentPowerPlants.${selectedIndex}.powerPlant`
  );

  // 獲取所有電廠數據用於 Chip 顯示
  const allPowerPlants = watch("transferDocumentPowerPlants") || [];

  const currentCompanyInfo = useMemo(() => {
    return companiesData?.companies.list.find(
      (company: any) => company.id === currentCompany?.value
    );
  }, [companiesData, currentCompany]);

  const currentCompanyContractInfo = useMemo(() => {
    return currentCompanyInfo?.companyContracts?.find(
      (contract: any) => contract.id === currentCompanyContract?.value
    );
  }, [currentCompanyInfo, currentCompanyContract]);

  const powerPlants = useMemo(() => {
    return currentCompanyContractInfo?.powerPlants || [];
  }, [currentCompanyContractInfo]);

  const currentPowerPlantInfo = useMemo(() => {
    const powerPlant = powerPlants.find(
      (pp: any) => pp.id === currentPowerPlant?.value
    );
    return {
      number: powerPlant?.number || "N/A",
      volume: powerPlant?.volume || "N/A",
      estimatedAnnualPowerGeneration:
        powerPlant?.estimatedAnnualPowerGeneration || 0,
    };
  }, [powerPlants, currentPowerPlant]);

  const transferRate =
    watch(`transferDocumentPowerPlants.${selectedIndex}.transferRate`) || 0;

  // 優化事件處理函數，使用 useCallback 避免不必要的重新渲染
  const handleChipClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleChipDelete = useCallback((index: number) => {
    setDeleteIndex(index);
  }, []);

  // 優化新增電廠邏輯
  const handleAddPowerPlants = useCallback(() => {
    const emptyArray = [];
    for (let i = 1; i <= addPowerPlantNumber; i++) {
      // 每次創建新的對象引用，避免共享引用問題
      emptyArray.push({
        estimateAnnualSupply: 0,
        company: { label: "", value: "" },
        companyContract: { label: "", value: "" },
        powerPlant: { label: "", value: "" },
        transferRate: 0,
      });
    }
    append(emptyArray);
    if (!fields.length) {
      setSelectedIndex(0);
    }
  }, [addPowerPlantNumber, append, fields.length]);

  // 當電廠數量超過一定閾值時，使用虛擬化渲染
  const VIRTUALIZATION_THRESHOLD = 50;
  const shouldVirtualize = fields.length > VIRTUALIZATION_THRESHOLD;

  // 如果需要虛擬化，只渲染當前可見的 chips
  const visibleChips = useMemo(() => {
    if (!shouldVirtualize) return fields;
    
    // 簡單的虛擬化邏輯：只顯示選中項目周圍的 chips
    const range = 20; // 顯示範圍
    const start = Math.max(0, selectedIndex - range);
    const end = Math.min(fields.length, selectedIndex + range + 1);
    
    return fields.slice(start, end).map((item, index) => ({
      ...item,
      originalIndex: start + index
    }));
  }, [fields, selectedIndex, shouldVirtualize]);

  // 生成 Chip 標籤的函數
  const getChipLabel = useCallback((index: number) => {
    const powerPlantInfo = allPowerPlants[index];
    
    // 優先顯示電廠名稱
    const powerPlantName = powerPlantInfo?.powerPlant;
    const powerPlantNameValue = powerPlantName?.label || powerPlantName?.value;
    
    if (powerPlantNameValue && powerPlantNameValue.trim()) {
      return powerPlantNameValue;
    }
    
    // 如果沒有電廠名稱，顯示公司名稱
    const companyName = powerPlantInfo?.company;
    const companyNameValue = companyName?.label || companyName?.value;
    
    if (companyNameValue && companyNameValue.trim()) {
      return `${companyNameValue}`;
    }
    
    // 最後回退到序號
    return `電廠${index + 1}`;
  }, [allPowerPlants]);

  return (
    <>
      <Typography variant="h5" textAlign="left">
        電廠
      </Typography>
      <Box display="flex" flexDirection="column" rowGap="24px">
        {/* Chip 列表 - 優化渲染 */}
        <Box display="flex" gap="8px" flexWrap="wrap">
          {/* 如果電廠數量過多，顯示導航信息 */}
          {shouldVirtualize && (
            <Typography variant="caption" color="text.secondary" width="100%">
              共 {fields.length} 個電廠，當前顯示第 {selectedIndex + 1} 個周圍的電廠
            </Typography>
          )}
          
          {(shouldVirtualize ? visibleChips : fields).map((item, index) => {
            const actualIndex = shouldVirtualize ? (item as any).originalIndex : index;
            return (
              <Chip
                key={item.id}
                label={getChipLabel(actualIndex)}
                aria-label={`電廠${actualIndex + 1}`}
                handleClick={() => handleChipClick(actualIndex)}
                handleDelete={() => handleChipDelete(actualIndex)}
                selected={selectedIndex === actualIndex}
              />
            );
          })}
          
          {/* 如果使用虛擬化且有隱藏的項目，提供快速導航 */}
          {shouldVirtualize && (
            <Box display="flex" gap="4px" alignItems="center" ml="auto">
              <Typography variant="caption">跳至：</Typography>
              <InputNumber
                sx={{ width: "60px" }}
                value={selectedIndex + 1}
                onChange={(number: any) => {
                  if (number > 0 && number <= fields.length) {
                    setSelectedIndex(number - 1);
                  }
                }}
                placeholder="電廠"
              />
            </Box>
          )}
        </Box>
        
        {/* 詳細欄位 - 只渲染當前選中的項目，提升性能 */}
        {selectedIndex >= 0 && selectedIndex < fields.length && (
          <Box
            key={fields[selectedIndex].id}
            display="flex"
            flexDirection="column"
            rowGap="24px"
          >
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${selectedIndex}.company`}
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
                  label={`公司${selectedIndex + 1}名稱`}
                  aria-label={`公司${selectedIndex + 1}名稱`}
                  placeholder="請填入"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${selectedIndex}.companyContract`}
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
                  label={`公司合約${selectedIndex + 1}名稱`}
                  aria-label={`公司合約${selectedIndex + 1}名稱`}
                  placeholder="請填入"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentPowerPlants.${selectedIndex}.powerPlant`}
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
                  label={`電廠${selectedIndex + 1}名稱`}
                  aria-label={`電廠${selectedIndex + 1}名稱`}
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
              name={`transferDocumentPowerPlants.${selectedIndex}.transferRate`}
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
              name={`transferDocumentPowerPlants.${selectedIndex}.estimateAnnualSupply`}
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
        )}
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
            onClick={handleAddPowerPlants}
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
            // 如果刪除的是當前選中的項目，調整選中索引
            if (deleteIndex === selectedIndex) {
              setSelectedIndex(Math.max(0, Math.min(selectedIndex, fields.length - 2)));
            } else if (deleteIndex < selectedIndex) {
              setSelectedIndex(selectedIndex - 1);
            }
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
