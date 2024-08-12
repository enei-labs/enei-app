import { CompanyBillTemplateData } from "@components/ElectricBill/CompanyBillTemplate";

export const getCompanyBillTemplateData = (data: any) => {
  console.log({ data });
  const companyBillTemplateData: CompanyBillTemplateData= {
    billingMonth: data[1][6],
    // 計費期間
    billingDate: data[2][6],
    // 公司名稱
    companyName: data[2][1],
    // 負責人名稱
    responsibleName: data[2][2],
    // 轉供單編號
    transferNumber: data[4][6],
    // 電號
    serialNumber: data[7][1],
    // 電廠名稱
    powerPlantName: data[7][3],
    // 契約編號
    contractNumber: data[7][5],
    // 基本資訊
    basicInfo: {
      // 併聯容量
      totalCapacity: data[10][2],
      // 轉供容量
      transferCapacity: data[11][2],
    },
    // 廠址
    city: data[14][1],
    address: data[15][1],
    // 電費計算
    billing: {
      // 轉供度數
      transferKwh: data[10][5],
      // 費率
      price: data[11][5],
      // 電費（未稅）
      amount: data[12][5],
      // 營業稅
      tax: data[14][5],
      // 總金額
      totalIncludeTax: data[15][5],
    },
  };

  return companyBillTemplateData;
};