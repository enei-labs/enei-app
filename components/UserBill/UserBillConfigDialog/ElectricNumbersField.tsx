import { InputAutocomplete, InputNumber, InputText, InputSearch } from "@components/Input";
import { FormData } from "./FormData";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import {
  Control,
  Controller,
  ControllerRenderProps,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useState, useCallback, useMemo } from "react";
import { IconBtn } from "@components/Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DialogAlert from "@components/DialogAlert";
import { useUserContracts } from "@utils/hooks/queries";
import { ElectricNumberInfo } from "@core/graphql/types";

interface ElectricNumbersFieldProps {
  control: Control<any, any>;
  field: ControllerRenderProps<FormData, any>;
  userId: string;
}

export function ElectricNumbersField(props: ElectricNumbersFieldProps) {
  const { field: rootField, control, userId } = props;

  const { data, loading } = useUserContracts({
    variables: { userId },
  });

  const [addElectricNumber, setAddElectricNumber] = useState<number>(1);
  const [deleteElectricNumberIndex, setDeleteElectricNumberIndex] =
    useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  const formData = useWatch({ control, name: rootField?.name });

  // 優化刪除事件處理
  const handleDeleteClick = useCallback((index: number) => {
    setDeleteElectricNumberIndex(index);
  }, []);

  // 優化新增邏輯
  const handleAddElectricNumbers = useCallback(() => {
    const emptyArray = [];
    for (let i = 1; i <= addElectricNumber; i++) {
      // 每次創建新的對象引用，避免共享引用問題
      emptyArray.push({});
    }
    append(emptyArray);
  }, [addElectricNumber, append]);

  // 當電號數量超過一定閾值時，使用虛擬化渲染
  const VIRTUALIZATION_THRESHOLD = 50;
  const shouldVirtualize = fields.length > VIRTUALIZATION_THRESHOLD;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // 搜尋匹配的電號
  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    
    const searchTerm = searchValue.toLowerCase();
    const matches: { index: number; matchType: string }[] = [];
    
    formData?.forEach((item: any, index: number) => {
      // 搜尋電號
      const electricNumber = item?.number?.label || item?.number?.value;
      if (electricNumber && electricNumber.toLowerCase().includes(searchTerm)) {
        matches.push({ index, matchType: '電號' });
      }
    });
    
    return matches;
  }, [formData, searchValue]);

  // 如果需要虛擬化，只渲染當前可見的欄位
  const visibleFields = useMemo(() => {
    // 如果有搜尋結果，只顯示搜尋結果
    if (searchValue.trim() && searchResults.length > 0) {
      return searchResults.map(({ index }) => fields[index]).filter(Boolean);
    }
    
    if (!shouldVirtualize) return fields;
    
    const { start, end } = visibleRange;
    return fields.slice(start, Math.min(end, fields.length));
  }, [fields, shouldVirtualize, visibleRange, searchValue, searchResults]);

  // 處理虛擬化滾動
  const handleRangeChange = useCallback((newStart: number) => {
    const range = 20;
    setVisibleRange({
      start: newStart,
      end: newStart + range
    });
  }, []);

  if (loading) return <CircularProgress size="24px" />;

  const priceMap = new Map();

  const flattenElectricNumberOptions =
    data?.userContracts.list.reduce((agg: ElectricNumberInfo[], curr) => {
      if (!curr.electricNumberInfos || !curr.electricNumberInfos.length)
        return agg;
      curr.electricNumberInfos.forEach((info) => {
        priceMap.set(info.number, curr.price);
      });
      return [...agg, ...curr.electricNumberInfos];
    }, [] as ElectricNumberInfo[]) ?? [];

  return (
    <>
      {/* 搜尋電號 */}
      <InputSearch
        placeholder="搜尋電號..."
        onChange={(value) => setSearchValue(value)}
      />
      
      {/* 搜尋結果提示 */}
      {searchValue.trim() && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="16px">
          <Typography variant="caption" color="text.secondary">
            {searchResults.length > 0 
              ? `找到 ${searchResults.length} 個匹配項目` 
              : "沒有找到匹配的電號"}
          </Typography>
          <Button
            size="small"
            onClick={() => setSearchValue("")}
            sx={{ minWidth: "auto", padding: "4px 8px" }}
          >
            清空搜尋
          </Button>
        </Box>
      )}
      
      {/* 如果電號數量過多，顯示導航信息 */}
      {shouldVirtualize && !searchValue.trim() && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="16px">
          <Typography variant="caption" color="text.secondary">
            共 {fields.length} 個電號，當前顯示第 {visibleRange.start + 1} - {Math.min(visibleRange.end, fields.length)} 個
          </Typography>
          <Box display="flex" gap="8px" alignItems="center">
            <Typography variant="caption">跳至：</Typography>
            <InputNumber
              sx={{ width: "80px" }}
              value={visibleRange.start + 1}
              onChange={(number: any) => {
                if (number > 0 && number <= fields.length) {
                  handleRangeChange(number - 1);
                }
              }}
              placeholder="項目"
            />
            <Typography variant="caption">/ {fields.length}</Typography>
          </Box>
        </Box>
      )}

      {/* 如果有搜尋但沒有結果，不顯示任何欄位 */}
      {!(searchValue.trim() && searchResults.length === 0) && 
        (shouldVirtualize || Boolean(searchValue.trim()) ? visibleFields : fields).map((field, index) => {
          // 對於虛擬化渲染或搜尋結果，需要計算實際的 fieldIndex
          const fieldIndex = shouldVirtualize && !searchValue.trim() 
            ? visibleRange.start + index 
            : searchValue.trim() && searchResults.length > 0 
              ? searchResults[index]?.index 
              : index;
        
        const selectedNumbers =
          formData
            ?.filter(
              (item: any, idx: number) =>
                idx !== fieldIndex && item?.number?.value
            )
            .map((item: any) => item.number.value) || [];

        return (
          <Box display={"flex"} key={field.id} columnGap="12px">
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.number`}
              render={({ field }) => {
                return (
                  <InputAutocomplete
                    sx={{ width: "600px" }}
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    options={
                      flattenElectricNumberOptions.map((o) => ({
                        label: o.number,
                        value: o.number,
                        disabled: selectedNumbers.includes(o.number),
                      })) ?? []
                    }
                    label={`用戶電號${fieldIndex + 1}`}
                    placeholder={"請填入"}
                    required
                  />
                );
              }}
            />
            <Controller
              control={control}
              name={`${rootField.name}.${fieldIndex}.price`}
              render={({ field }) => {
                return (
                  <InputText
                    disabled
                    {...field}
                    label={`採購電價（元/kWh）`}
                    value={
                      priceMap.get(formData?.[fieldIndex]?.number?.value) ?? 0
                    }
                  />
                );
              }}
            />
            <IconBtn
              icon={<CloseIcon />}
              onClick={() => handleDeleteClick(fieldIndex)}
            />
          </Box>
        );
      })
      }

      {/* 如果使用虛擬化，提供導航按鈕 */}
      {shouldVirtualize && !searchValue.trim() && (
        <Box display="flex" justifyContent="center" gap="8px" my="16px">
          <Button
            size="small"
            disabled={visibleRange.start === 0}
            onClick={() => handleRangeChange(Math.max(0, visibleRange.start - 20))}
          >
            上一頁
          </Button>
          <Button
            size="small"
            disabled={visibleRange.end >= fields.length}
            onClick={() => handleRangeChange(Math.min(fields.length - 20, visibleRange.start + 20))}
          >
            下一頁
          </Button>
        </Box>
      )}

      {/* 新增用戶電號欄位 */}
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        flexWrap={"nowrap"}
        padding={"8px 16px"}
        border={"2px dashed #B2DFDB"}
        borderRadius={"16px"}
      >
        <Grid container flexWrap={"nowrap"} alignItems={"center"} gap={"8px"}>
          <Typography variant="subtitle2">新增</Typography>
          <InputNumber
            sx={{ width: "74px" }}
            value={addElectricNumber}
            onChange={(number: any) => {
              setAddElectricNumber(number);
            }}
          ></InputNumber>
          <Typography variant="subtitle2">個用戶電號欄位</Typography>
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleAddElectricNumbers}
          >
            新增
          </Button>
        </Grid>
      </Grid>

      {deleteElectricNumberIndex !== -1 ? (
        <DialogAlert
          open={deleteElectricNumberIndex !== -1}
          title={"刪除用戶電號欄位"}
          content={"是否確認要刪除用戶電號欄位？"}
          onConfirm={() => {
            remove(deleteElectricNumberIndex);
            setDeleteElectricNumberIndex(-1);
            
            // 如果刪除的項目在當前可見範圍外，調整顯示範圍
            if (shouldVirtualize && deleteElectricNumberIndex < visibleRange.start) {
              setVisibleRange(prev => ({
                start: Math.max(0, prev.start - 1),
                end: Math.max(20, prev.end - 1)
              }));
            }
          }}
          onClose={() => {
            setDeleteElectricNumberIndex(-1);
          }}
        />
      ) : null}
    </>
  );
}
