import {
  mapDailyHistory,
  mapStationReading,
  parseLocalDateTime,
  toNumber,
} from './station.service';

describe('station mapping', () => {
  it('parses numbers sent as strings', () => {
    expect(toNumber('12.4')).toBe(12.4);
    expect(toNumber('3,5')).toBe(3.5);
    expect(toNumber(7)).toBe(7);
    expect(toNumber('')).toBeNull();
    expect(toNumber(null)).toBeNull();
    expect(toNumber('n/d')).toBeNull();
  });

  it('parses MySQL/MeteoNetwork local timestamps', () => {
    const date = parseLocalDateTime('2026-10-06 21:30:00')!;
    expect(date.getHours()).toBe(21);
    expect(date.getDate()).toBe(6);
    expect(parseLocalDateTime('')).toBeNull();
  });

  it('maps a MeteoNetwork realtime record', () => {
    const reading = mapStationReading({
      observation_time_local: '2026-10-06 21:30:00',
      temperature: '11.2',
      rh: '87',
      dew_point: '9.1',
      mslp: '1016.4',
      wind_speed: '3.2',
      wind_gust: '8',
      wind_direction: 'nne',
      daily_rain: '1.4',
      current_tmin: '8.3',
      current_tmed: '12.0',
      current_tmax: '17.9',
    });
    expect(reading.temperature).toBe(11.2);
    expect(reading.humidity).toBe(87);
    expect(reading.windDirection).toBe('NNE');
    expect(reading.dailyRain).toBe(1.4);
    expect(reading.temperatureMax).toBe(17.9);
    expect(reading.rainRate).toBeNull();
  });

  it('converts numeric wind direction to compass points', () => {
    expect(mapStationReading({ wind_direction: 270 }).windDirection).toBe('O');
  });

  it('accepts a `date` field, sorts by day and ignores non-array responses', () => {
    const rows = mapDailyHistory([
      { date: '2026-10-05', med_temp: '11', daily_rain: '0' },
      { date: '2026-10-03 08:00:00', med_temp: '9' },
    ]);
    expect(rows.map((r) => r.date.getDate())).toEqual([3, 5]);
    expect(rows[1].date.getHours()).toBe(0);
    expect(mapDailyHistory({ error: 'x' })).toEqual([]);
  });

  it('maps getTemps rows and drops invalid dates', () => {
    const rows = mapDailyHistory([
      {
        timestamp: '2026-10-05 00:10:00',
        min_temp: '7.1',
        med_temp: '11',
        max_temp: '16.2',
        daily_rain: '2.4',
      },
      { timestamp: 'garbage', min_temp: '1' },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ min: 7.1, med: 11, max: 16.2, rain: 2.4 });
    expect(rows).not.toContainEqual(expect.objectContaining({ min: 1 }));
  });
});
