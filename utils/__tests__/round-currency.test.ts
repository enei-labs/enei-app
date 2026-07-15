import { roundCurrency } from '../round-currency';
import { formatNumber } from '../format';

describe('roundCurrency', () => {
  it('修正浮點誤差:20875 度 × 5.1 元 = 106462.5 → 四捨五入 106463(Math.round 直接算會得 106462)', () => {
    // 20875 * 5.1 在 IEEE 754 下是 106462.49999999999
    expect(roundCurrency(20875 * 5.1)).toBe(106463);
  });

  it('非 .5 邊界值不受影響:20868 × 5.1 = 106426.8 → 106427', () => {
    expect(roundCurrency(20868 * 5.1)).toBe(106427);
  });

  it('恰為 .5 時進位(不及一元者四捨五入)', () => {
    expect(roundCurrency(2.5)).toBe(3);
  });
});

describe('formatNumber', () => {
  it('顯示金額同樣修正浮點誤差:20875 × 5.1 顯示為 106,463', () => {
    expect(formatNumber(20875 * 5.1)).toBe('106,463');
  });
});
