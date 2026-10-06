import { httpResource } from '@angular/common/http';
import { DestroyRef, inject, Service } from '@angular/core';
import { AppConfig, AppConfigService } from '../config/app-config';
import { OpenMeteoResponse, WeatherSnapshot } from './weather.models';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

/** Dati meteo da Open-Meteo, ricaricati automaticamente ogni `weatherRefreshMinutes`. */
@Service()
export class WeatherService {
  private readonly config = inject(AppConfigService).config;

  readonly weather = httpResource<WeatherSnapshot>(
    () => ({ url: OPEN_METEO_URL, params: buildOpenMeteoParams(this.config()) }),
    { parse: (raw) => mapOpenMeteoResponse(raw as OpenMeteoResponse) },
  );

  constructor() {
    const minutes = this.config().weatherRefreshMinutes;
    if (minutes > 0) {
      const timer = setInterval(() => this.weather.reload(), minutes * 60_000);
      inject(DestroyRef).onDestroy(() => clearInterval(timer));
    }
  }

  reload(): void {
    this.weather.reload();
  }
}

export function buildOpenMeteoParams(config: AppConfig): Record<string, string | number> {
  return {
    latitude: config.location.latitude,
    longitude: config.location.longitude,
    timezone: config.location.timezone,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'pressure_msl',
      'precipitation',
      'wind_speed_10m',
      'wind_gusts_10m',
      'wind_direction_10m',
      'weather_code',
      'is_day',
    ].join(','),
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_hours: 24,
    forecast_days: 7,
  };
}

export function mapOpenMeteoResponse(raw: OpenMeteoResponse): WeatherSnapshot {
  const { current, hourly, daily } = raw;
  return {
    current: {
      time: new Date(current.time),
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      windGusts: current.wind_gusts_10m,
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    },
    hourly: hourly.time.map((time, i) => ({
      time: new Date(time),
      temperature: hourly.temperature_2m[i],
      precipitationProbability: hourly.precipitation_probability[i] ?? 0,
    })),
    daily: daily.time.map((date, i) => ({
      date: new Date(`${date}T00:00`),
      weatherCode: daily.weather_code[i],
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      precipitationSum: daily.precipitation_sum[i],
    })),
  };
}
