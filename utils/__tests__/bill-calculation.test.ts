import {
  calcIndustryBillAmount,
  calcTax,
  calcTaxAndTotal,
  calcUserBillCharges,
  UserBillChargeFlags,
  UserBillFeeRates,
} from '../bill-calculation';

/**
 * Golden 測試：這些數字是用「不及一元者四捨五入」的規則手算過的，
 * 同一組數字也用在 enei-api 的測試，兩邊必須一致。
 * 改任何一個期望值之前，先確認是規則變了，不是實作壞了。
 */
describe('calcIndustryBillAmount（發電業電費 = 度數 × 費率）', () => {
  it.each([
    // [度數, 費率, 期望金額, 說明]
    [6889, 5.1, 35134, '2026-07 富崧 草屯農會PV0038：35133.9 → 35134（prod 實際單據）'],
    [20875, 5.1, 106463, '106462.5 → 106463；直接 Math.round 會因浮點誤差得到 106462（2026-07 修過的 bug）'],
    [20868, 5.1, 106427, '106426.8 → 106427，非 .5 邊界'],
    [22987, 5, 114935, '整數費率，無四捨五入'],
    [33596, 5.15, 173019, '173019.4 → 173019'],
    [228237, 5.2, 1186832, '1186832.4 → 1186832，大度數'],
    [1, 5.125, 5, '5.125 → 5'],
    [1, 5.5, 6, '5.5 → 6，恰為 .5 進位'],
    [0, 5.1, 0, '零度數'],
  ])('%s 度 × %s 元 = %s（%s）', (degree, price, expected) => {
    expect(calcIndustryBillAmount(degree, price)).toBe(expected);
  });
});

describe('calcTax / calcTaxAndTotal（營業稅 5%）', () => {
  it.each([
    [35134, 1757, 36891, '1756.7 → 1757（prod 實際單據）'],
    [106463, 5323, 111786, '5323.15 → 5323'],
    [10, 1, 11, '0.5 → 1，恰為 .5 進位'],
    [9, 0, 9, '0.45 → 0'],
  ])('未稅 %s → 稅 %s、含稅 %s（%s）', (amount, tax, total) => {
    expect(calcTax(amount)).toBe(tax);
    expect(calcTaxAndTotal(amount)).toEqual({ tax, totalIncludeTax: total });
  });
});

describe('calcUserBillCharges（用戶繳費通知單）', () => {
  const allToUser: UserBillChargeFlags = {
    chargeSubstitutionFee: true,
    chargeCertificationFee: true,
    chargeCertificationServiceFee: true,
  };
  const noneToUser: UserBillChargeFlags = {
    chargeSubstitutionFee: false,
    chargeCertificationFee: false,
    chargeCertificationServiceFee: false,
  };
  const rates: UserBillFeeRates = { certificateVerificationFee: 0.003, certificateServiceFee: 0.0005 };

  it('單一電號、三項規費都向用戶收', () => {
    const r = calcUserBillCharges(
      [{ number: '01-23-4567-89-0', degree: 1000, price: 4.3, fee: 210 }],
      allToUser,
      rates,
    );
    expect(r.usage).toEqual([{ serialNumber: '01-23-4567-89-0', kwh: 1000, price: 4.3, amount: 4300 }]);
    expect(r.totalKwh).toBe(1000);
    expect(r.totalAmount).toBe(4300);
    expect(r.substitutionFee).toBe(200); // 210 含稅 ÷ 1.05 = 200
    expect(r.certificationFee).toBe(3); // 1000 × 0.003
    expect(r.certificationServiceFee).toBe(1); // 1000 × 0.0005 = 0.5 → 1
    expect(r.totalFee).toBe(204);
    expect(r.total).toBe(4504);
    expect(r.tax).toBe(225); // 225.2 → 225
    expect(r.totalIncludeTax).toBe(4729);
  });

  it('規費全部由艾涅爾吸收時，帳單只有電費與稅', () => {
    const r = calcUserBillCharges([{ degree: 1000, price: 4.3, fee: 210 }], noneToUser, rates);
    expect(r.substitutionFee).toBe(0);
    expect(r.certificationFee).toBe(0);
    expect(r.certificationServiceFee).toBe(0);
    expect(r.totalFee).toBe(0);
    expect(r.total).toBe(4300);
    expect(r.tax).toBe(215);
    expect(r.totalIncludeTax).toBe(4515);
  });

  it('多電號：每個電號的電費先各自四捨五入再加總', () => {
    // 3 × 5.15 = 15.45 → 15；3 × 5.15 = 15.45 → 15；合計 30；若先加總則 30.9 → 31
    const r = calcUserBillCharges(
      [
        { number: 'A', degree: 3, price: 5.15 },
        { number: 'B', degree: 3, price: 5.15 },
      ],
      noneToUser,
      rates,
    );
    expect(r.usage.map((u) => u.amount)).toEqual([15, 15]);
    expect(r.totalAmount).toBe(30);
  });

  it('代輸費：多電號的台電含稅費用先加總再除以 1.05 再四捨五入', () => {
    // 50 + 50 = 100 → 95.238 → 95；若各自除再加：47.619 → 48 + 48 = 96
    const r = calcUserBillCharges(
      [
        { degree: 1, price: 1, fee: 50 },
        { degree: 1, price: 1, fee: 50 },
      ],
      { ...noneToUser, chargeSubstitutionFee: true },
      rates,
    );
    expect(r.substitutionFee).toBe(95);
  });

  it('浮點誤差：20875 度 × 5.1 的用戶電費也必須是 106463', () => {
    const r = calcUserBillCharges([{ degree: 20875, price: 5.1 }], noneToUser, rates);
    expect(r.totalAmount).toBe(106463);
    expect(r.tax).toBe(5323);
    expect(r.totalIncludeTax).toBe(111786);
  });

  it('空明細：全部為 0', () => {
    const r = calcUserBillCharges([], allToUser, rates);
    expect(r).toMatchObject({
      usage: [],
      totalKwh: 0,
      totalAmount: 0,
      substitutionFee: 0,
      certificationFee: 0,
      certificationServiceFee: 0,
      totalFee: 0,
      total: 0,
      tax: 0,
      totalIncludeTax: 0,
    });
  });

  it('缺欄位（degree / price / fee 未填）視為 0，不會產生 NaN', () => {
    const r = calcUserBillCharges([{ number: 'X' }], allToUser, rates);
    expect(Number.isNaN(r.totalIncludeTax)).toBe(false);
    expect(r.totalIncludeTax).toBe(0);
  });
});
