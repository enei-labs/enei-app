// 金額四捨五入（元為單位，不及一元者四捨五入）。
// 先以 12 位有效數字修正 IEEE 754 浮點誤差，
// 避免如 20875 * 5.1 = 106462.49999999999 被錯捨成 106462（真值 106462.5 應進位為 106463）
// 與 enei-api common/misc/round-currency.ts 及 enei-pdf-service src/utils/round-currency.ts 邏輯一致
export function roundCurrency(value: number): number {
  return Math.round(Number(value.toPrecision(12)));
}
