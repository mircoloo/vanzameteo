import { DailyHistory } from '../../../core/station/station.models';
import { summarizeMonth } from './month-stats';

const day = (
  d: number,
  min: number | null,
  med: number | null,
  max: number | null,
  rain: number | null,
): DailyHistory => ({
  date: new Date(2026, 8, d),
  min,
  med,
  max,
  rain,
});

describe('summarizeMonth', () => {
  it('computes temperature and rain statistics', () => {
    const stats = summarizeMonth([
      day(1, 8, 12, 18, 0),
      day(2, 5, 10, 14, 12.5),
      day(3, 9, 14, 22, 0.1),
      day(4, null, null, null, 3),
    ]);
    expect(stats.averageTemperature).toBe(12);
    expect(stats.highest).toEqual({ date: new Date(2026, 8, 3), value: 22 });
    expect(stats.lowest?.value).toBe(5);
    expect(stats.totalRain).toBeCloseTo(15.6);
    expect(stats.rainyDays).toBe(2);
    expect(stats.wettest?.value).toBe(12.5);
  });

  it('handles missing rain data', () => {
    const stats = summarizeMonth([day(1, 8, 12, 18, null)]);
    expect(stats.totalRain).toBeNull();
    expect(stats.rainyDays).toBe(0);
    expect(stats.wettest).toBeNull();
  });

  it('handles an empty list', () => {
    const stats = summarizeMonth([]);
    expect(stats.averageTemperature).toBeNull();
    expect(stats.highest).toBeNull();
  });
});
