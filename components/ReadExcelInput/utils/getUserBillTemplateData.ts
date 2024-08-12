import { UserBillTemplateData } from "@components/ElectricBill/UserBillTemplate"
import { excelDateToJSDate } from "@components/ReadExcelInput";
import { formatDateTime } from "@utils/format";


const getUsageData = (data: any[], startIndex: number): any[] => {
  const usageData = [];
  let rowsUsed = 0;

  for (let i = startIndex; i < data.length; i++) {
    if (!data[i][1]) break;
    usageData.push({
      serialNumber: data[i][1],
      kwh: data[i][2],
      price: data[i][4],
      amount: data[i][6],
    });
    rowsUsed++;

  }
  return [usageData, rowsUsed];
};

const findUsageIndex = (data: any[]): number => {
  for (let i = 0; i < data.length; i++) {
    if (data[i][1] === '電號') {
      return i + 1; // 返回 "電號" 的下一行索引
    }
  }
  throw new Error('無法找到 "電號" 行');
};

export const getUserBillTemplateData = (data: any) => {
  const usageIndex = findUsageIndex(data);
  const [usageData, usageRowsCount] = getUsageData(data, usageIndex);
  const baseIndex = usageIndex + usageRowsCount;

  const userBillTemplateData: UserBillTemplateData = {
    billingMonth: data[1][7],
    billingDate: data[2][7],
    companyName: data[2][1],
    customerName: data[2][2],
    customerNumber: data[4][7],
    address: data[3][1],
    dueDate: formatDateTime(excelDateToJSDate(data[7][3])),
    amount: data[7][1],
    bank: {
      bankName: data[7][6],
      accountName: data[8][6],
      accountNumber: data[9][6],
    },
    usage: usageData,
    totalKwh: data[baseIndex + 1][2],
    totalAmount: data[baseIndex + 1][6],
    substitutionFee: data[baseIndex + 3][2],
    certificationFee: data[baseIndex + 4][2],
    certificationServiceFee: data[baseIndex + 5][2],
    totalFee: data[baseIndex + 4][6],
    total: data[baseIndex + 7][2],
    tax: data[baseIndex + 7][6],
    totalIncludeTax: data[baseIndex + 9][2],
  };

  return userBillTemplateData;
}