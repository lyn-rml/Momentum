import { categoryNames } from '../../core/preferences/preferences';
import { dailyQuote, quoteForDate } from './quotes';

describe('Daily quote selection', () => {
  it('keeps the quote stable throughout a local calendar day', () => {
    for (const category of categoryNames) {
      expect(quoteForDate(category, new Date(2026, 9, 22, 0, 1))).toBe(
        quoteForDate(category, new Date(2026, 9, 22, 23, 59)),
      );
      expect(quoteForDate(category, new Date(2026, 9, 22))).not.toBe(
        quoteForDate(category, new Date(2026, 9, 23)),
      );
    }
  });
  it('rotates within selected categories and is independent of selection order', () => {
    const first = new Date(2026, 9, 22);
    const second = new Date(2026, 9, 23);
    expect(dailyQuote(['Coding', 'Study'], first)).toEqual(dailyQuote(['Study', 'Coding'], first));
    expect(dailyQuote(['Coding', 'Study'], first).category).not.toBe(
      dailyQuote(['Coding', 'Study'], second).category,
    );
    expect(['Coding', 'Study']).toContain(dailyQuote(['Coding', 'Study'], first).category);
  });
});
