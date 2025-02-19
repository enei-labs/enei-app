import React, { useRef, ChangeEvent } from "react";
import { Button } from "@mui/material";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import { readExcelFile } from "utils/readExcelFile";

interface ImportTransferDegreeBtnProps {
  onExcelParsed: (
    excelData: Map<string, { degree: number; fee: number }>
  ) => void;
}

// The keyword that identifies the relevant sheet
const SHEET_KEY_WORD = "台電代輸繳費單";

// Define column indexes for better clarity (these index values correspond to the input file structure)
// Adjust the indexes if your file structure changes.
const COL_INDEXES = {
  userNumber: 1, // 用戶電號
  industryNumber: 3, // 發電電號
  degree: 5, // 轉供度數
  fee: 10, // 費用
};

export default function ImportTransferDegreeBtn({
  onExcelParsed,
}: ImportTransferDegreeBtnProps) {
  // Ref for hidden file upload input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles file selection and processes the uploaded Excel file.
   * It reads the file, locates the relevant sheet, aggregates data based on unique keys,
   * and then passes the parsed excel data to the parent component via callback.
   */
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    try {
      // Read the excel file using the designated utility
      const excelData = await readExcelFile(file);

      // Locate the sheet that includes the specific keyword in its name
      const targetSheetKey = Object.keys(excelData).find((sheetName) =>
        sheetName.includes(SHEET_KEY_WORD)
      );

      if (!targetSheetKey) {
        throw new Error(
          `Sheet with name including "${SHEET_KEY_WORD}" not found`
        );
      }

      // Retrieve the data for the located sheet
      const tpcBillData = excelData[targetSheetKey];

      // Use a Map to aggregate entries using a unique key based on userNumber and industryNumber
      const aggregatedData = new Map<
        string,
        { userNumber: any; industryNumber: any; degree: number; fee: number }
      >();

      // Skip the first three rows (assuming they are headers or summary rows)
      tpcBillData.slice(3).forEach((row: any) => {
        const userNumber = row[COL_INDEXES.userNumber];
        const industryNumber = row[COL_INDEXES.industryNumber];
        // Ensure that the numeric fields are converted to numbers
        const degree = Number(row[COL_INDEXES.degree]) || 0;
        const fee = Number(row[COL_INDEXES.fee]) || 0;
        const key = `${userNumber}-${industryNumber}`;

        if (aggregatedData.has(key)) {
          // If the entry exists, update degree and fee by summing the values.
          const existingEntry = aggregatedData.get(key)!;
          aggregatedData.set(key, {
            ...existingEntry,
            degree: existingEntry.degree + degree,
            fee: existingEntry.fee + fee,
          });
        } else {
          // Otherwise, create a new entry
          aggregatedData.set(key, { userNumber, industryNumber, degree, fee });
        }
      });

      // Log the aggregated and raw sheet data for debugging purposes
      console.log("Aggregated Data:", aggregatedData);
      console.log("TPC Bill Data:", tpcBillData);

      // Pass the parsed Excel data to the parent component
      onExcelParsed(aggregatedData);
    } catch (error) {
      console.error("Failed to read Excel file:", error);
    }

    // Reset the file input so that selecting the same file again will trigger onChange.
    event.target.value = "";
  };

  return (
    <>
      {/* Hidden file input element */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
      />
      <Button
        startIcon={<ImportExportOutlinedIcon />}
        onClick={() => fileInputRef.current?.click()}
      >
        匯入轉供度數
      </Button>
    </>
  );
}
