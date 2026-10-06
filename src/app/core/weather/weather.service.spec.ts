import { DEFAULT_APP_CONFIG } from '../config/app-config';
import { OpenMeteoResponse } from './weather.models';
import { buildOpenMeteoParams, mapOpenMeteoResponse } from './weather.service';

const RESPONSE: OpenMeteoResponse = {
  current: {
    time: '2026-10-06T14:00',
    temperature_2m: 17.4,
    apparent_temperature: 16.1,
    relative_humidity_2m: 60,
    pressure_msl: 1018.2,
    precipitation: 0,
    wind_speed_10m: 8.3,
    wind_gusts_10m: 20.1,
    wind_direction_10m: 200,
    weather_code: 2,
    is_day: 1,
  },
  hourly: {
    time: ['2026-10-06T14:00', '2026-10-06T15:00'],
    temperature_2m: [17.4, 17.9],
    precipitation_probability: [5, 10],
  },
  daily: {
    time: ['2026-10-06', '2026-10-07'],
    weather_code: [2, 61],
    temperature_2m_max: [19, 15],
    temperature_2m_min: [9, 8],
    precipitation_sum: [0, 4.2],
  },
};

describe('Open-Meteo mapping', () => {
  it('builds request params from the config', () => {
    const params = buildOpenMeteoParams(DEFAULT_APP_CONFIG);
    expect(params['latitude']).toBe(DEFAULT_APP_CONFIG.location.latitude);
    expect(params['timezone']).toBe('Europe/Rome');
    expect(params['current']).toContain('weather_code');
  });

  it('maps the API response to a snapshot', () => {
    const snapshot = mapOpenMeteoResponse(RESPONSE);
    expect(snapshot.current.temperature).toBe(17.4);
    expect(snapshot.current.isDay).toBe(true);
    expect(snapshot.hourly).toHaveLength(2);
    expect(snapshot.hourly[1].temperature).toBe(17.9);
    expect(snapshot.daily[1].precipitationSum).toBe(4.2);
    expect(snapshot.daily[1].date.getDate()).toBe(7);
  });
});
