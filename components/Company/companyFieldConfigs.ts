import { FieldConfig } from "@core/types";
import {
  companyIdentifierValidation,
  emailListValidated,
  textValidated,
} from "@core/types/fieldConfig";
import { CompanyType } from "@core/graphql/types";
import { companyTypeRadios } from "@core/look-up/company-type";
import { useMemo } from "react";

// 前 3 欄為「公司資訊」區塊、後 3 欄為「聯絡人資訊」區塊（兩個 dialog 都以 slice(0, 3) / slice(3) 切分）
export const companyFieldConfigs: FieldConfig[] = [
  {
    type: "RADIO",
    name: "type",
    label: "戶別",
    radios: companyTypeRadios,
    required: true,
  },
  {
    type: "TEXT",
    name: "name",
    label: "公司名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "taxId",
    label: "統一編號",
    required: true,
    validated: companyIdentifierValidation,
  },
  {
    type: "TEXT",
    name: "contactName",
    label: "聯絡人姓名",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "contactPhone",
    label: "聯絡人電話",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "contactEmails",
    label: "聯絡人信箱（多個信箱以逗號分隔）",
    required: true,
    validated: emailListValidated,
  },
];

/** 依戶別切換顯示 label；回傳新陣列 identity 讓 memo 化的 FieldsController 重繪 */
export const useCompanyDisplayConfigs = (type: CompanyType | undefined) =>
  useMemo(
    () =>
      companyFieldConfigs.map((config) => {
        if (config.name === "name") {
          return { ...config, label: type === CompanyType.Individual ? "姓名／名稱" : "公司名稱" };
        }
        if (config.name === "taxId") {
          return { ...config, label: type === CompanyType.Individual ? "身分證字號" : "統一編號" };
        }
        return config;
      }),
    [type],
  );
