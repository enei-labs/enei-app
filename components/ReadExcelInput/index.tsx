import CompanyBillTemplate, {
  CompanyBillTemplateData,
} from "@components/ElectricBill/CompanyBillTemplate";
import UserBillTemplate, {
  UserBillTemplateData,
} from "@components/ElectricBill/UserBillTemplate";
import { getCompanyBillTemplateData } from "@components/ReadExcelInput/utils/getCompanyBillTemplateData";
import { getUserBillTemplateData } from "@components/ReadExcelInput/utils/getUserBillTemplateData";
import { Button, Divider, Alert, CircularProgress } from "@mui/material";
import { readExcelFile } from "@utils/readExcelFile";
import { fileToBase64 } from "@utils/fileToBase64";
import { forwardRef, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useMutation, useLazyQuery } from "@apollo/client";
import { IMPORT_MANUAL_USER_BILL, IMPORT_MANUAL_INDUSTRY_BILL } from "@core/graphql/mutations";
import { FIND_USER_BILL_CONFIG_BY_ELECTRIC_NUMBERS, FIND_INDUSTRY_BILL_CONFIG_BY_ELECTRIC_NUMBER } from "@core/graphql/queries";

export const excelDateToJSDate = (serial: number) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;

  const total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;

  const total_minutes = Math.floor(total_seconds / 60);
  const minutes = total_minutes % 60;

  const hours = Math.floor(total_minutes / 60);

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
};

export const PrintWrapper = forwardRef<
  HTMLDivElement,
  {
    userBillTemplatesData: UserBillTemplateData[];
    companyBillTemplatesData: CompanyBillTemplateData[];
  }
>((props, ref) => (
  <div ref={ref}>
    {(props.userBillTemplatesData ?? []).map((userBillTemplateData, index) => (
      <div style={{ pageBreakAfter: "always" }} key={index}>
        <UserBillTemplate data={userBillTemplateData} />
      </div>
    ))}
    {(props.companyBillTemplatesData ?? []).map(
      (companyBillTemplateData, index) => (
        <div style={{ pageBreakAfter: "always" }} key={index}>
          <CompanyBillTemplate data={companyBillTemplateData} />
        </div>
      )
    )}
  </div>
));

PrintWrapper.displayName = "PrintWrapper";

export interface ReadExcelInputProps {
  /** 只讀取第一個 tab (用於發電業電費單頁面) */
  singleTabMode?: boolean;
}

export function ReadExcelInput({ singleTabMode = false }: ReadExcelInputProps) {
  const [userBillTemplatesData, setUserBillTemplatesData] = useState<
    UserBillTemplateData[]
  >([]);
  const [companyBillTemplatesData, setCompanyBillTemplatesData] = useState<
    CompanyBillTemplateData[]
  >([]);
  console.log({ companyBillTemplatesData })
  const [fileName, setFileName] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importUserBill, { loading: loadingUserBill }] = useMutation(IMPORT_MANUAL_USER_BILL);
  const [importIndustryBill, { loading: loadingIndustryBill }] = useMutation(IMPORT_MANUAL_INDUSTRY_BILL);

  const [findUserBillConfig] = useLazyQuery(FIND_USER_BILL_CONFIG_BY_ELECTRIC_NUMBERS);
  const [findIndustryBillConfig] = useLazyQuery(FIND_INDUSTRY_BILL_CONFIG_BY_ELECTRIC_NUMBER);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploadedFile(file);
    setSaveStatus({ type: null, message: "" });
    const data = await readExcelFile(file);

    if (singleTabMode) {
      // 只讀取第一個 tab
      const firstTab = Object.entries(data)[0];
      if (firstTab) {
        const [key, value] = firstTab;
        if (key.includes("用戶")) {
          setUserBillTemplatesData([getUserBillTemplateData(value)]);
          setCompanyBillTemplatesData([]);
        } else if (key.includes("發電")) {
          setCompanyBillTemplatesData([getCompanyBillTemplateData(value)]);
          setUserBillTemplatesData([]);
        }
      }
    } else {
      // 原本的邏輯：讀取所有 tabs
      const userBillsData = Object.entries(data)
        .filter(([key]) => {
          return key.includes("用戶");
        })
        .map(([key, value]) => getUserBillTemplateData(value));
      const companyBillsData = Object.entries(data)
        .filter(([key]) => key.includes("發電"))
        .map(([key, value]) => getCompanyBillTemplateData(value));

      setUserBillTemplatesData(userBillsData);
      setCompanyBillTemplatesData(companyBillsData);
    }
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
  });

  const handleClear = () => {
    setUserBillTemplatesData([]);
    setCompanyBillTemplatesData([]);
    setFileName("");
    setUploadedFile(null);
    setSaveStatus({ type: null, message: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveToDatabase = async () => {
    if (!uploadedFile) {
      setSaveStatus({ type: "error", message: "沒有可儲存的檔案" });
      return;
    }

    try {
      // Convert file to base64
      const fileContent = await fileToBase64(uploadedFile);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Save user bills
      for (const userBillData of userBillTemplatesData) {
        try {
          // Extract electric numbers from usage data
          const electricNumbers = userBillData.usage.map((u) => u.serialNumber);

          // Find config by electric numbers
          const { data: configData } = await findUserBillConfig({
            variables: { electricNumbers },
          });

          const configs = configData?.findUserBillConfigByElectricNumbers || [];

          if (configs.length === 0) {
            errorCount++;
            errors.push(`用戶電費單: 找不到包含電號 ${electricNumbers.join(", ")} 的設定`);
            continue;
          }

          if (configs.length > 1) {
            errorCount++;
            errors.push(
              `用戶電費單: 電號 ${electricNumbers.join(", ")} 對應到多個設定 (${configs
                .map((c: any) => c.name)
                .join(", ")})，請聯絡管理員`
            );
            continue;
          }

          const userBillConfigId = configs[0].id;

          const { data } = await importUserBill({
            variables: {
              input: {
                ...userBillData,
                fileContent,
                fileName: uploadedFile.name,
                userBillConfigId,
              },
            },
          });

          if (data?.importManualUserBill?.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(`用戶電費單: ${data?.importManualUserBill?.message || "未知錯誤"}`);
          }
        } catch (error: any) {
          errorCount++;
          errors.push(`用戶電費單: ${error.message}`);
        }
      }

      // Save industry bills
      for (const industryBillData of companyBillTemplatesData) {
        try {
          // Find config by electric number
          const { data: configData } = await findIndustryBillConfig({
            variables: { electricNumber: industryBillData.serialNumber },
          });

          const configs = configData?.findIndustryBillConfigByElectricNumber || [];

          if (configs.length === 0) {
            errorCount++;
            errors.push(
              `發電業電費單 (${industryBillData.powerPlantName}): 找不到包含電號 ${industryBillData.serialNumber} 的設定`
            );
            continue;
          }

          if (configs.length > 1) {
            errorCount++;
            errors.push(
              `發電業電費單 (${industryBillData.powerPlantName}): 電號 ${
                industryBillData.serialNumber
              } 對應到多個設定 (${configs.map((c: any) => c.name).join(", ")})，請聯絡管理員`
            );
            continue;
          }

          const industryBillConfigId = configs[0].id;
          const config = configs[0];

          // Use contactName or industry name as responsibleName if not provided in Excel
          const responsibleName =
            industryBillData.responsibleName ||
            config.contactName ||
            config.industry?.name ||
            industryBillData.companyName;

          const { data } = await importIndustryBill({
            variables: {
              input: {
                ...industryBillData,
                responsibleName,
                fileContent,
                fileName: uploadedFile.name,
                industryBillConfigId,
              },
            },
          });

          if (data?.importManualIndustryBill?.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(
              `發電業電費單 (${industryBillData.powerPlantName}): ${
                data?.importManualIndustryBill?.message || "未知錯誤"
              }`
            );
          }
        } catch (error: any) {
          errorCount++;
          errors.push(`發電業電費單: ${error.message}`);
        }
      }

      // Display result
      if (errorCount === 0) {
        setSaveStatus({
          type: "success",
          message: `成功儲存 ${successCount} 筆電費單到資料庫`,
        });
      } else {
        setSaveStatus({
          type: "error",
          message: `儲存完成：成功 ${successCount} 筆，失敗 ${errorCount} 筆。錯誤：${errors.join("; ")}`,
        });
      }
    } catch (error: any) {
      setSaveStatus({
        type: "error",
        message: `儲存失敗：${error.message}`,
      });
    }
  };

  return (
    <>
      {singleTabMode && (
        <Alert severity="info" sx={{ marginBottom: 2 }}>
          ⚠️ 注意：此頁面只會讀取 Excel 檔案的第一個 tab（工作表）
        </Alert>
      )}
      <input
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
        accept=".xlsx"
      />

      {(userBillTemplatesData.length > 0 ||
        companyBillTemplatesData.length > 0) && (
        <>
          <Button onClick={handlePrint} sx={{ marginRight: "6px" }}>
            列印
          </Button>
          <Button
            onClick={handleSaveToDatabase}
            sx={{ marginRight: "6px" }}
            variant="contained"
            disabled={loadingUserBill || loadingIndustryBill}
          >
            {loadingUserBill || loadingIndustryBill ? (
              <>
                <CircularProgress size={20} sx={{ marginRight: 1 }} />
                儲存中...
              </>
            ) : (
              "儲存到資料庫"
            )}
          </Button>
          <Button onClick={handleClear}>清空</Button>

          {saveStatus.type && (
            <Alert severity={saveStatus.type} sx={{ marginTop: 2, marginBottom: 2 }}>
              {saveStatus.message}
            </Alert>
          )}

          <Divider sx={{ margin: 2 }} />
          <PrintWrapper
            ref={componentRef}
            userBillTemplatesData={userBillTemplatesData}
            companyBillTemplatesData={companyBillTemplatesData}
          />
        </>
      )}
    </>
  );
}
