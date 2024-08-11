import CompanyBillTemplate, {
  CompanyBillTemplateData,
} from "@components/ElectricBill/CompanyBillTemplate";
import UserBillTemplate, {
  UserBillTemplateData,
} from "@components/ElectricBill/UserBillTemplate";
import { Button, Divider } from "@mui/material";
import { formatDateTime } from "@utils/format";
import { readExcelFile } from "@utils/readExcelFile";
import { forwardRef, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

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

const PrintWrapper = forwardRef<
  HTMLDivElement,
  {
    userBillTemplateData: UserBillTemplateData | null;
    companyBillTemplateData: CompanyBillTemplateData | null;
  }
>((props, ref) => (
  <div ref={ref}>
    {props.userBillTemplateData && (
      <div style={{ pageBreakAfter: "always" }}>
        <UserBillTemplate data={props.userBillTemplateData} />
      </div>
    )}
    {props.companyBillTemplateData && (
      <CompanyBillTemplate data={props.companyBillTemplateData} />
    )}
  </div>
));

PrintWrapper.displayName = "PrintWrapper";

export function ReadExcelInput() {
  const [userBillTemplateData, setUserBillTemplateData] =
    useState<UserBillTemplateData | null>(null);
  const [companyBillTemplateData, setCompanyBillTemplateData] =
    useState<CompanyBillTemplateData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const data = await readExcelFile(file);

    const userBillData = data["用戶"];
    const companyBillData = data["發電"];

    const userBillTemplateData: UserBillTemplateData = {
      billingMonth: userBillData[1][7],
      billingDate: userBillData[2][7],
      companyName: userBillData[2][1],
      customerName: userBillData[2][2],
      customerNumber: userBillData[4][7],
      address: userBillData[3][1],
      dueDate: formatDateTime(excelDateToJSDate(userBillData[7][3])),
      amount: userBillData[7][1],
      bank: {
        bankName: userBillData[7][6],
        accountName: userBillData[8][6],
        accountNumber: userBillData[9][6],
      },
      usage: userBillData
        .slice(12, 14)
        .filter((row) => !!row[1])
        .map((row) => ({
          serialNumber: row[1],
          kwh: row[2],
          price: row[4],
          amount: row[6],
        })),
      totalKwh: userBillData[14][2],
      totalAmount: userBillData[14][6],
      substitutionFee: userBillData[16][2],
      certificationFee: userBillData[17][2],
      certificationServiceFee: userBillData[18][2],
      totalFee: userBillData[16][6],
      total: userBillData[20][2],
      tax: userBillData[20][6],
      totalIncludeTax: userBillData[22][2],
    };

    const companyBillTemplateData: CompanyBillTemplateData = {
      billingMonth: companyBillData[1][6],
      // 計費期間
      billingDate: companyBillData[2][6],
      // 公司名稱
      companyName: companyBillData[2][1],
      // 負責人名稱
      responsibleName: companyBillData[2][2],
      // 轉供單編號
      transferNumber: companyBillData[4][6],
      // 電號
      serialNumber: companyBillData[7][1],
      // 電廠名稱
      powerPlantName: companyBillData[7][3],
      // 契約編號
      contractNumber: companyBillData[7][5],
      // 基本資訊
      basicInfo: {
        // 併聯容量
        totalCapacity: companyBillData[10][2],
        // 轉供容量
        transferCapacity: companyBillData[11][2],
      },
      // 廠址
      address: companyBillData[15][1],
      // 電費計算
      billing: {
        // 轉供度數
        transferKwh: companyBillData[10][5],
        // 費率
        price: companyBillData[11][5],
        // 電費（未稅）
        amount: companyBillData[12][5],
        // 營業稅
        tax: companyBillData[14][5],
        // 總金額
        totalIncludeTax: companyBillData[15][5],
      },
    };

    console.info({ companyBillData });
    console.info({ userBillData });
    console.info({ companyBillTemplateData });
    setUserBillTemplateData(userBillTemplateData);
    setCompanyBillTemplateData(companyBillTemplateData);
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
  });

  const handleClear = () => {
    setUserBillTemplateData(null);
    setCompanyBillTemplateData(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileUpload} ref={fileInputRef} />

      {(userBillTemplateData || companyBillTemplateData) && (
        <>
          <Button onClick={handlePrint} sx={{ marginRight: "6px" }}>
            列印
          </Button>
          <Button onClick={handleClear}>清空</Button>
          <Divider sx={{ margin: 2 }} />
          <PrintWrapper
            ref={componentRef}
            userBillTemplateData={userBillTemplateData}
            companyBillTemplateData={companyBillTemplateData}
          />
        </>
      )}
    </>
  );
}
