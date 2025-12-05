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
import { SEND_USER_BILL_EMAIL } from "@core/graphql/mutations/sendUserBillEmail";
import { SEND_INDUSTRY_BILL_EMAIL } from "@core/graphql/mutations/sendIndustryBillEmail";
import { FIND_USER_BILL_CONFIG_BY_ELECTRIC_NUMBERS, FIND_INDUSTRY_BILL_CONFIG_BY_ELECTRIC_NUMBER, FIND_INDUSTRY_BILL_BY_ELECTRIC_NUMBER_AND_MONTH } from "@core/graphql/queries";
import { toast } from "react-toastify";

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
  const [importedBills, setImportedBills] = useState<Array<{
    id: string;
    type: 'user' | 'industry';
    name: string;
    configName?: string;
  }>>([]);
  const [showSendEmailButtons, setShowSendEmailButtons] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importUserBill, { loading: loadingUserBill }] = useMutation(IMPORT_MANUAL_USER_BILL);
  const [importIndustryBill, { loading: loadingIndustryBill }] = useMutation(IMPORT_MANUAL_INDUSTRY_BILL);
  const [sendUserBillEmail, { loading: sendingUserBill }] = useMutation(SEND_USER_BILL_EMAIL);
  const [sendIndustryBillEmail, { loading: sendingIndustryBill }] = useMutation(SEND_INDUSTRY_BILL_EMAIL);

  const [findUserBillConfig] = useLazyQuery(FIND_USER_BILL_CONFIG_BY_ELECTRIC_NUMBERS);
  const [findIndustryBillConfig] = useLazyQuery(FIND_INDUSTRY_BILL_CONFIG_BY_ELECTRIC_NUMBER);
  const [findIndustryBill] = useLazyQuery(FIND_INDUSTRY_BILL_BY_ELECTRIC_NUMBER_AND_MONTH);

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

  const handleSendEmail = async (bill: typeof importedBills[0]) => {
    try {
      if (bill.type === 'user') {
        const result = await sendUserBillEmail({
          variables: { userBillId: bill.id }
        });

        if (result.data?.sendUserBillEmail.success) {
          toast.success(`${bill.name} 已成功寄出！`);
          setImportedBills(prev => prev.filter(b => b.id !== bill.id));
        } else {
          toast.error(`寄送失敗：${result.data?.sendUserBillEmail.message || '未知錯誤'}`);
        }
      } else {
        const result = await sendIndustryBillEmail({
          variables: { industryBillId: bill.id }
        });

        if (result.data?.sendIndustryBillEmail.success) {
          toast.success(`${bill.name} 已成功寄出！`);
          setImportedBills(prev => prev.filter(b => b.id !== bill.id));
        } else {
          toast.error(`寄送失敗：${result.data?.sendIndustryBillEmail.message || '未知錯誤'}`);
        }
      }
    } catch (error: any) {
      toast.error(`寄送失敗：${error.message}`);
    }
  };

  const handleClear = () => {
    setUserBillTemplatesData([]);
    setCompanyBillTemplatesData([]);
    setFileName("");
    setUploadedFile(null);
    setSaveStatus({ type: null, message: "" });
    setImportedBills([]);
    setShowSendEmailButtons(false);
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
      const successfulBills: typeof importedBills = [];

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
            successfulBills.push({
              id: data.importManualUserBill.billId!,
              type: 'user',
              name: `${userBillData.customerName} - ${userBillData.billingMonth}`,
              configName: '用戶電費單'
            });
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

          // Find existing bill by electric number and month
          // Convert billing month to YYYY-MM format if needed
          let billingMonthParam = industryBillData.billingMonth;
          const chineseMatch = industryBillData.billingMonth.match(/^(\d{4})年(\d{1,2})月?$/);
          if (chineseMatch) {
            const year = chineseMatch[1];
            const month = chineseMatch[2].padStart(2, '0');
            billingMonthParam = `${year}-${month}`;
          }

          // Subtract one month for the search
          const [yearStr, monthStr] = billingMonthParam.split('-');
          let searchYear = parseInt(yearStr, 10);
          let searchMonth = parseInt(monthStr, 10) - 1;
          if (searchMonth === 0) {
            searchMonth = 12;
            searchYear -= 1;
          }
          const searchBillingMonth = `${searchYear}-${String(searchMonth).padStart(2, '0')}`;

          const { data: billData } = await findIndustryBill({
            variables: {
              electricNumber: industryBillData.serialNumber,
              billingMonth: searchBillingMonth,
              industryBillConfigId,
            },
          });

          const existingBill = billData?.findIndustryBillByElectricNumberAndMonth;

          if (!existingBill) {
            errorCount++;
            errors.push(
              `發電業電費單 (${industryBillData.powerPlantName}): 找不到對應的電費單記錄（電號: ${industryBillData.serialNumber}, 月份: ${industryBillData.billingMonth})`
            );
            continue;
          }

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
                industryBillId: existingBill.id,
                responsibleName,
                fileContent,
                fileName: uploadedFile.name,
                industryBillConfigId,
              },
            },
          });

          if (data?.importManualIndustryBill?.success) {
            successCount++;
            successfulBills.push({
              id: data.importManualIndustryBill.billId!,
              type: 'industry',
              name: `${industryBillData.powerPlantName} - ${industryBillData.billingMonth}`,
              configName: '發電業電費單'
            });
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
        if (successfulBills.length > 0) {
          setImportedBills(successfulBills);
          setShowSendEmailButtons(true);
        }
      } else {
        setSaveStatus({
          type: "error",
          message: `儲存完成：成功 ${successCount} 筆，失敗 ${errorCount} 筆。錯誤：${errors.join("; ")}`,
        });
        if (successfulBills.length > 0) {
          setImportedBills(successfulBills);
          setShowSendEmailButtons(true);
        }
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

          {showSendEmailButtons && importedBills.length > 0 && (
            <div style={{ marginTop: 16, padding: 16, border: '1px solid #e0e0e0', borderRadius: 4, backgroundColor: '#f5f5f5' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                ✅ 匯入成功！選擇要寄送的電費單：
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {importedBills.map((bill) => (
                  <div
                    key={bill.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      border: '1px solid #d0d0d0',
                      borderRadius: 4,
                      backgroundColor: '#ffffff',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{bill.name}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>
                        {bill.type === 'user' ? '用戶電費單' : '發電業電費單'}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendEmail(bill)}
                      disabled={sendingUserBill || sendingIndustryBill}
                      variant="contained"
                      color="primary"
                    >
                      {(sendingUserBill || sendingIndustryBill) ? (
                        <>
                          <CircularProgress size={16} sx={{ marginRight: 1 }} />
                          寄送中...
                        </>
                      ) : (
                        '寄送電費單'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
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
