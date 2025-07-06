import { InputNumber, InputText, InputSearch } from "@components/Input";
import { FormData } from "@components/UserContract/UserContractDialog/FormData";
import { Box, Button, Grid, Typography } from "@mui/material";
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

interface TableNumbersFieldProps {
  control: Control<any, any>;
  field: ControllerRenderProps<FormData, any>;
}

export function TableNumbersField(props: TableNumbersFieldProps) {
  const { field: rootField, control } = props;

  const [addTableNumber, setAddTableNumber] = useState<number>(1);
  const [deleteTableNumberIndex, setDeleteTableNumberIndex] =
    useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: rootField.name,
  });

  const formData = useWatch({ control, name: rootField?.name });

  // 優化刪除事件處理
  const handleDeleteClick = useCallback((index: number) => {
    setDeleteTableNumberIndex(index);
  }, []);

  // 優化新增邏輯
  const handleAddTableNumbers = useCallback(() => {
    const emptyArray = [];
    for (let i = 1; i <= addTableNumber; i++) {
      // 每次創建新的字符串，避免共享引用問題
      emptyArray.push("");
    }
    append(emptyArray);
  }, [addTableNumber, append]);

  // 當表號數量超過一定閾值時，使用虛擬化渲染
  const VIRTUALIZATION_THRESHOLD = 50;
  const shouldVirtualize = fields.length > VIRTUALIZATION_THRESHOLD;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // 搜尋匹配的表號
  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    
    const searchTerm = searchValue.toLowerCase();
    const matches: { index: number; matchType: string }[] = [];
    
    formData?.forEach((item: any, index: number) => {
      // 搜尋表號
      if (item && typeof item === 'string' && item.toLowerCase().includes(searchTerm)) {
        matches.push({ index, matchType: '表號' });
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

  return (
    <>
      {/* 搜尋表號 */}
      <InputSearch
        placeholder="搜尋表號..."
        onChange={(value) => setSearchValue(value)}
      />
      
      {/* 搜尋結果提示 */}
      {searchValue.trim() && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="16px">
          <Typography variant="caption" color="text.secondary">
            {searchResults.length > 0 
              ? `找到 ${searchResults.length} 個匹配項目` 
              : "沒有找到匹配的表號"}
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
      
      {/* 如果表號數量過多，顯示導航信息 */}
      {shouldVirtualize && !searchValue.trim() && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="16px">
          <Typography variant="caption" color="text.secondary">
            共 {fields.length} 個表號，當前顯示第 {visibleRange.start + 1} - {Math.min(visibleRange.end, fields.length)} 個
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
        
        return (
          <Controller
            key={field.id}
            control={control}
            name={`${rootField.name}.${fieldIndex}`}
            render={({ field }) => {
              return (
                <Box display={"flex"} columnGap="12px">
                  <InputText
                    {...field}
                    label={`表號${fieldIndex + 1}`}
                    placeholder={"請填入"}
                    required
                  />
                  <IconBtn
                    icon={<CloseIcon />}
                    onClick={() => handleDeleteClick(fieldIndex)}
                  />
                </Box>
              );
            }}
          />
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

      {/* 新增表號欄位 */}
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
            value={addTableNumber}
            onChange={(number: any) => {
              if (number > 0) {
                setAddTableNumber(number);
              }
            }}
          ></InputNumber>
          <Typography variant="subtitle2">表號欄位</Typography>
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleAddTableNumbers}
          >
            新增
          </Button>
        </Grid>
      </Grid>

      {deleteTableNumberIndex !== -1 ? (
        <DialogAlert
          open={deleteTableNumberIndex !== -1}
          title={"刪除表號"}
          content={"是否確認要刪除表號？"}
          onConfirm={() => {
            remove(deleteTableNumberIndex);
            setDeleteTableNumberIndex(-1);
            
            // 如果刪除的項目在當前可見範圍外，調整顯示範圍
            if (shouldVirtualize && deleteTableNumberIndex < visibleRange.start) {
              setVisibleRange(prev => ({
                start: Math.max(0, prev.start - 1),
                end: Math.max(20, prev.end - 1)
              }));
            }
          }}
          onClose={() => {
            setDeleteTableNumberIndex(-1);
          }}
        />
      ) : null}
    </>
  );
}
