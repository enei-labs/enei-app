import * as XLSX from 'xlsx';

export const readExcelFile = async (file: File) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  const result: { [sheetName: string]: any[] } = {};

  // 讀取前二十個工作表
  for (let i = 0; i < Math.min(20, workbook.SheetNames.length); i++) {
    const sheetName = workbook.SheetNames[i];
    const sheet = workbook.Sheets[sheetName];
    result[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  }

  return result;
};