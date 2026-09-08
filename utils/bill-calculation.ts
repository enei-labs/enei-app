import { roundCurrency } from "./round-currency";

/**
 * 電費單金額計算的唯一實作（純函式，無 I/O）。
 *
 * 規則來源：發電業購電通知單與用戶繳費通知單。金額以「元」為單位，不及一元者四捨五入（roundCurrency）。
 * `UserBillDialog` 與 `IndustryBillDialog` 都必須經由這裡計算，不得各自重寫；
 * golden 數字見 bill-calculation.test.ts，並與 enei-api common/misc/bill-calculation.ts 保持一致。
 */

/** 營業稅率 5% */
export const TAX_RATE = 0.05;

/** 發電業電費（未稅）= 轉供度數 × 費率，四捨五入到元 */
export function calcIndustryBillAmount(transferDegree: number, price: number): number {
  return roundCurrency((Number(transferDegree) || 0) * (Number(price) || 0));
}

/** 營業稅 = 未稅金額 × 5%，四捨五入到元 */
export function calcTax(amountBeforeTax: number): number {
  return roundCurrency(amountBeforeTax * TAX_RATE);
}

/** 未稅金額 → { tax, totalIncludeTax } */
export function calcTaxAndTotal(amountBeforeTax: number): { tax: number; totalIncludeTax: number } {
  const tax = calcTax(amountBeforeTax);
  return { tax, totalIncludeTax: amountBeforeTax + tax };
}

/** 用戶電費單：單一電號的用電明細輸入 */
export interface UserBillUsageInput {
  /** 電號 */
  number?: string;
  /** 用電度數 */
  degree?: number;
  /** 費率（元/度） */
  price?: number;
  /** 台電代輸費（含稅，來自台電帳單） */
  fee?: number;
}

/** 用戶電費單：規費由誰負擔（USER = 向用戶收，SELF = 艾涅爾自行吸收，不列在帳單上） */
export interface UserBillChargeFlags {
  /** 代輸費向用戶收 */
  chargeSubstitutionFee: boolean;
  /** 憑證審查費向用戶收 */
  chargeCertificationFee: boolean;
  /** 憑證服務費向用戶收 */
  chargeCertificationServiceFee: boolean;
}

/** 用戶電費單：規費費率（元/度） */
export interface UserBillFeeRates {
  /** 憑證審查費費率 */
  certificateVerificationFee: number;
  /** 憑證服務費費率 */
  certificateServiceFee: number;
}

export interface UserBillUsageLine {
  serialNumber: string;
  kwh: number;
  price: number;
  amount: number;
}

export interface UserBillCharges {
  usage: UserBillUsageLine[];
  /** 度數合計 */
  totalKwh: number;
  /** 電費合計（未稅，各電號金額先各自四捨五入再加總） */
  totalAmount: number;
  /** 代輸費（台電含稅金額 ÷ 1.05 還原為未稅，四捨五入） */
  substitutionFee: number;
  /** 憑證審查費 = 度數合計 × 費率，四捨五入 */
  certificationFee: number;
  /** 憑證服務費 = 度數合計 × 費率，四捨五入 */
  certificationServiceFee: number;
  /** 規費合計 */
  totalFee: number;
  /** 合計（未稅）= 電費合計 + 規費合計 */
  total: number;
  /** 營業稅 = 合計 × 5%，四捨五入 */
  tax: number;
  /** 總計（含稅） */
  totalIncludeTax: number;
}

/**
 * 用戶電費單完整計算。
 *
 * 注意順序：每個電號的電費先各自四捨五入再加總（不是加總後再四捨五入），
 * 三項規費也各自四捨五入；營業稅以「未稅合計」為基礎計算一次。
 */
export function calcUserBillCharges(
  infos: UserBillUsageInput[],
  flags: UserBillChargeFlags,
  rates: UserBillFeeRates,
): UserBillCharges {
  const usage: UserBillUsageLine[] = infos.map((info) => ({
    serialNumber: info.number || "",
    kwh: info.degree || 0,
    price: info.price || 0,
    amount: calcIndustryBillAmount(info.degree || 0, info.price || 0),
  }));

  const totalKwh = usage.reduce((sum, u) => sum + u.kwh, 0);
  const totalAmount = usage.reduce((sum, u) => sum + u.amount, 0);

  const substitutionFee = flags.chargeSubstitutionFee
    ? roundCurrency(infos.reduce((sum, info) => sum + (info.fee || 0), 0) / (1 + TAX_RATE))
    : 0;
  const certificationFee = flags.chargeCertificationFee
    ? roundCurrency(totalKwh * rates.certificateVerificationFee)
    : 0;
  const certificationServiceFee = flags.chargeCertificationServiceFee
    ? roundCurrency(totalKwh * rates.certificateServiceFee)
    : 0;

  const totalFee = substitutionFee + certificationFee + certificationServiceFee;
  const total = totalAmount + totalFee;
  const { tax, totalIncludeTax } = calcTaxAndTotal(total);

  return {
    usage,
    totalKwh,
    totalAmount,
    substitutionFee,
    certificationFee,
    certificationServiceFee,
    totalFee,
    total,
    tax,
    totalIncludeTax,
  };
}
