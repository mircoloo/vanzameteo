import { DailyHistory } from '../../../core/station/station.models';

/** Pioggia minima (mm) perché un giorno conti come "piovoso". */
export const RAIN_DAY_THRESHOLD = 0.2;

export interface DayValue {
  date: Date;
  value: number;
}

export interface MonthStats {
  averageTemperature: number | null;
  highest: DayValue | null;
  lowest: DayValue | null;
  totalRain: number | null;
  rainyDays: number;
  wettest: DayValue | null;
}

export function summarizeMonth(days: DailyHistory[]): MonthStats {
  const values = (pick: (d: DailyHistory) => number | null): DayValue[] =>
    days.flatMap((d) => {
      const value = pick(d);
      return value === null ? [] : [{ date: d.date, value }];
    });

  const med = values((d) => d.med);
  const max = values((d) => d.max);
  const min = values((d) => d.min);
  const rain = values((d) => d.rain);

  const extreme = (list: DayValue[], better: (a: number, b: number) => boolean) =>
    list.reduce<DayValue | null>(
      (best, d) => (!best || better(d.value, best.value) ? d : best),
      null,
    );

  const wettest = extreme(rain, (a, b) => a > b);

  return {
    averageTemperature: med.length ? med.reduce((sum, d) => sum + d.value, 0) / med.length : null,
    highest: extreme(max, (a, b) => a > b),
    lowest: extreme(min, (a, b) => a < b),
    totalRain: rain.length ? rain.reduce((sum, d) => sum + d.value, 0) : null,
    rainyDays: rain.filter((d) => d.value >= RAIN_DAY_THRESHOLD).length,
    wettest: wettest && wettest.value > 0 ? wettest : null,
  };
}
