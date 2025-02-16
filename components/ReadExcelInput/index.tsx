import CompanyBillTemplate, {
  CompanyBillTemplateData,
} from "@components/ElectricBill/CompanyBillTemplate";
import UserBillTemplate, {
  UserBillTemplateData,
} from "@components/ElectricBill/UserBillTemplate";
import { getCompanyBillTemplateData } from "@components/ReadExcelInput/utils/getCompanyBillTemplateData";
import { getUserBillTemplateData } from "@components/ReadExcelInput/utils/getUserBillTemplateData";
import { Button, Divider } from "@mui/material";
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

export function ReadExcelInput() {
  const [userBillTemplatesData, setUserBillTemplatesData] = useState<
    UserBillTemplateData[]
  >([]);
  const [companyBillTemplatesData, setCompanyBillTemplatesData] = useState<
    CompanyBillTemplateData[]
  >([]);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const data = await readExcelFile(file);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
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
          <Button onClick={handleClear}>清空</Button>
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
