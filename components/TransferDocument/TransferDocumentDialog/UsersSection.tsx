import { useMemo, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import InputAutocomplete from "@components/Input/InputAutocomplete";
import InputText from "@components/Input/InputText";
import InputNumber from "@components/Input/InputNumber";
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

  // 取得目前用戶欄位中選取的用戶契約
  const currentUserContract = watch(
    `transferDocumentUsers.${selectedIndex}.userContract`
  );
  const selectedUserContract = useMemo(() => {
    return userContractsData?.userContracts.list.find(
      (contract: any) => contract.id === currentUserContract?.value
    );
  }, [userContractsData, currentUserContract]);

  return (
    <>
      <Typography variant="h5" textAlign="left">
        用戶電號
      </Typography>
      <Box display="flex" flexDirection="column" rowGap="24px">
        {/* Chip 列表 */}
        <Box display="flex" gap="8px" flexWrap="wrap">
          {fields.map((item, index) => (
            <Chip
              key={item.id}
              label={`電號${index + 1}`}
              aria-label={`電號${index + 1}`}
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
              name={`transferDocumentUsers.${index}.user`}
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
                name={`transferDocumentUsers.${index}.userContract`}
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
                name={`transferDocumentUsers.${index}.electricNumber`}
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
              name={`transferDocumentUsers.${index}.expectedYearlyPurchaseDegree`}
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
              name={`transferDocumentUsers.${index}.monthlyTransferDegree`}
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
              name={`transferDocumentUsers.${index}.yearlyTransferDegree`}
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
        ))}
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
            onClick={() => {
              const emptyUserInput = {
                monthlyTransferDegree: 0,
                user: { label: "", value: "" },
                userContract: { label: "", value: "" },
                electricNumber: { label: "", value: "" },
                yearlyTransferDegree: 0,
                expectedYearlyPurchaseDegree: 0,
              };
              const emptyArray = [];
              for (let i = 1; i <= addUserNumber; i++) {
                emptyArray.push(emptyUserInput);
              }
              append(emptyArray);
              if (!fields.length) setSelectedIndex(0);
            }}
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
