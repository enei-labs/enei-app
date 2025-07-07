import { useMemo, useState, useCallback } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import InputAutocomplete from "@components/Input/InputAutocomplete";
import InputText from "@components/Input/InputText";
import InputNumber from "@components/Input/InputNumber";
import InputSearch from "@components/Input/InputSearch";
import Chip from "@components/Chip";
import DialogAlert from "@components/DialogAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

interface UsersSectionProps {
  control: any;
  watch: any;
  fields: any[];
  append: (data: any) => void;
  remove: (index: number) => void;
  usersData: any;
  getUserContracts: (options: any) => void;
  userContractsData: any;
  addUserNumber: number;
  setAddUserNumber: (num: number) => void;
}

const UsersSection = ({
  control,
  watch,
  fields,
  append,
  remove,
  usersData,
  getUserContracts,
  userContractsData,
  addUserNumber,
  setAddUserNumber,
}: UsersSectionProps) => {
  // 管理用戶選取與刪除索引
  const [selectedIndex, setSelectedIndex] = useState<number>(
    fields.length ? 0 : -1
  );
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>("");

  // 取得目前用戶欄位中選取的用戶契約
  const currentUserContract = watch(
    `transferDocumentUsers.${selectedIndex}.userContract`
  );
  const selectedUserContract = useMemo(() => {
    return userContractsData?.userContracts.list.find(
      (contract: any) => contract.id === currentUserContract?.value
    );
  }, [userContractsData, currentUserContract]);

  // 獲取所有電號數據用於 Chip 顯示
  const allElectricNumbers = useMemo(() => 
    watch("transferDocumentUsers") || [], 
    [watch]
  );

  // 優化事件處理函數，使用 useCallback 避免不必要的重新渲染
  const handleChipClick = useCallback((index: number) => {
    setSelectedIndex(index);
    // 點擊時清空搜尋，讓用戶能夠看到完整的電號列表
    setSearchValue("");
  }, []);

  const handleChipDelete = useCallback((index: number) => {
    setDeleteIndex(index);
  }, []);

  // 優化新增用戶邏輯
  const handleAddUsers = useCallback(() => {
    const emptyArray = [];
    for (let i = 1; i <= addUserNumber; i++) {
      // 每次創建新的對象引用，避免共享引用問題
      emptyArray.push({
        monthlyTransferDegree: 0,
        user: { label: "", value: "" },
        userContract: { label: "", value: "" },
        electricNumber: { label: "", value: "" },
        yearlyTransferDegree: 0,
        expectedYearlyPurchaseDegree: 0,
      });
    }
    
    const currentLength = fields.length;
    append(emptyArray);
    
    // 設置選中索引為新增的第一個項目
    setSelectedIndex(currentLength);
  }, [addUserNumber, append, fields.length]);

  // 當電號數量超過一定閾值時，使用虛擬化渲染
  const VIRTUALIZATION_THRESHOLD = 50;
  const shouldVirtualize = fields.length > VIRTUALIZATION_THRESHOLD;

  // 搜尋匹配的電號
  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    
    const searchTerm = searchValue.toLowerCase();
    const matches: { index: number; matchType: string }[] = [];
    
    allElectricNumbers.forEach((item: any, index: number) => {
      // 搜尋電號
      const electricNumber = item?.electricNumber?.value || item?.electricNumber?.label;
      if (electricNumber && electricNumber.toLowerCase().includes(searchTerm)) {
        matches.push({ index, matchType: '電號' });
      }
      
      // 搜尋用戶名稱
      const userName = item?.user?.label || item?.user?.value;
      if (userName && userName.toLowerCase().includes(searchTerm)) {
        matches.push({ index, matchType: '用戶' });
      }
    });
    
    return matches;
  }, [allElectricNumbers, searchValue]);

  // 如果需要虛擬化，只渲染當前可見的 chips
  const visibleChips = useMemo(() => {
    // 如果有搜尋結果，只顯示搜尋結果
    if (searchValue.trim() && searchResults.length > 0) {
      return searchResults.map(({ index }) => ({
        ...fields[index],
        originalIndex: index
      }));
    }
    
    if (!shouldVirtualize) return fields;
    
    // 簡單的虛擬化邏輯：只顯示選中項目周圍的 chips
    const range = 20; // 顯示範圍
    const start = Math.max(0, selectedIndex - range);
    const end = Math.min(fields.length, selectedIndex + range + 1);
    
    return fields.slice(start, end).map((item, index) => ({
      ...item,
      originalIndex: start + index
    }));
  }, [fields, selectedIndex, shouldVirtualize, searchValue, searchResults]);

  // 生成 Chip 標籤的函數
  const getChipLabel = useCallback((index: number, isSearchResult?: boolean) => {
    const electricNumber = allElectricNumbers[index]?.electricNumber;
    const electricNumberValue = electricNumber?.value || electricNumber?.label;
    
    if (electricNumberValue && electricNumberValue.trim()) {
      return electricNumberValue;
    }
    
    // 如果沒有電號，顯示用戶名稱
    const userName = allElectricNumbers[index]?.user;
    const userNameValue = userName?.label || userName?.value;
    
    if (userNameValue && userNameValue.trim()) {
      return `${userNameValue}`;
    }
    
    // 最後回退到序號
    return `電號${index + 1}`;
  }, [allElectricNumbers]);

  return (
    <>
      <Typography variant="h5" textAlign="left">
        用戶電號
      </Typography>
      <Box display="flex" flexDirection="column" rowGap="24px">
        {/* 搜尋電號 */}
        <InputSearch
          placeholder="搜尋電號或用戶名稱..."
          onChange={(value) => setSearchValue(value)}
        />
        
        {/* 搜尋結果提示 */}
        {searchValue.trim() && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
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
        
        {/* Chip 列表 - 優化渲染 */}
        <Box display="flex" gap="8px" flexWrap="wrap">
          {/* 如果電號數量過多，顯示導航信息 */}
          {shouldVirtualize && !searchValue.trim() && (
            <Typography variant="caption" color="text.secondary" width="100%">
              共 {fields.length} 個電號，當前顯示第 {selectedIndex + 1} 個周圍的電號
            </Typography>
          )}
          
          {/* 如果有搜尋但沒有結果，不顯示任何 Chip */}
          {!(searchValue.trim() && searchResults.length === 0) && 
            (shouldVirtualize || Boolean(searchValue.trim()) ? visibleChips : fields).map((item, index) => {
              const actualIndex = (shouldVirtualize || Boolean(searchValue.trim())) ? (item as any).originalIndex : index;
              const isSearchResult = Boolean(searchValue.trim()) && searchResults.length > 0;
              return (
                <Chip
                  key={item.id}
                  label={getChipLabel(actualIndex, isSearchResult)}
                  aria-label={`電號${actualIndex + 1}`}
                  handleClick={() => handleChipClick(actualIndex)}
                  handleDelete={() => handleChipDelete(actualIndex)}
                  selected={selectedIndex === actualIndex}
                />
              );
            })
          }
          
          {/* 如果使用虛擬化且有隱藏的項目，提供快速導航 */}
          {shouldVirtualize && !searchValue.trim() && (
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
                placeholder="電號"
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
              name={`transferDocumentUsers.${selectedIndex}.user`}
              render={({ field }) => (
                <InputAutocomplete
                  {...field}
                  onChange={(e: any, newValue: any) => {
                    field.onChange(e, newValue);
                    if (e?.value) {
                      getUserContracts({
                        variables: { userId: e.value },
                      });
                    }
                  }}
                  options={
                    usersData?.users.list.map((o: any) => ({
                      label: o.name,
                      value: o.id,
                    })) || []
                  }
                  label="用戶名稱"
                  aria-label="用戶名稱"
                  placeholder="請填入"
                  required
                />
              )}
            />
            {userContractsData ? (
              <Controller
                control={control}
                name={`transferDocumentUsers.${selectedIndex}.userContract`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    onChange={(e: any) => field.onChange(e)}
                    options={
                      userContractsData?.userContracts.list.map((o: any) => ({
                        label: `${o.serialNumber}(${o.name})`,
                        value: o.id,
                      })) || []
                    }
                    label="用戶契約編號"
                    aria-label="用戶契約編號"
                    placeholder="請填入"
                    required
                  />
                )}
              />
            ) : null}
            {currentUserContract?.value ? (
              <Controller
                control={control}
                name={`transferDocumentUsers.${selectedIndex}.electricNumber`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    options={
                      selectedUserContract?.electricNumberInfos.map(
                        (info: any) => ({
                          label: info.number,
                          value: info.number,
                        })
                      ) || []
                    }
                    label="電號"
                    aria-label="電號"
                    placeholder="請填入"
                    required
                  />
                )}
              />
            ) : null}
            <Controller
              control={control}
              name={`transferDocumentUsers.${selectedIndex}.expectedYearlyPurchaseDegree`}
              render={({ field }) => (
                <InputText
                  {...field}
                  label="預計年採購度數（MWh）"
                  aria-label="預計年採購度數（MWh）"
                  placeholder="請填入"
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentUsers.${selectedIndex}.monthlyTransferDegree`}
              render={({ field }) => (
                <InputText
                  {...field}
                  label="每月轉供度數（kWh）"
                  aria-label="每月轉供度數（kWh）"
                  placeholder="請填入"
                  required
                />
              )}
            />
            <Controller
              control={control}
              name={`transferDocumentUsers.${selectedIndex}.yearlyTransferDegree`}
              render={({ field }) => (
                <InputText
                  {...field}
                  label="年轉供度數（kWh）"
                  aria-label="年轉供度數（kWh）"
                  placeholder="請填入"
                  required
                />
              )}
            />
          </Box>
        )}
      </Box>
      {/* 新增用戶欄位 */}
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
            value={addUserNumber}
            onChange={(number: any) => number > 0 && setAddUserNumber(number)}
          />
          <Typography variant="subtitle2">用戶欄位</Typography>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Button
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleAddUsers}
          >
            新增
          </Button>
        </Grid>
      </Grid>
      {deleteIndex !== -1 && (
        <DialogAlert
          open={deleteIndex !== -1}
          title="刪除用戶"
          content="是否確認要刪除用戶？"
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

export default UsersSection;
