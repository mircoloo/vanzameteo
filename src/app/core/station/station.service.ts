import { httpResource } from '@angular/common/http';
import { computed, DestroyRef, inject, Service } from '@angular/core';
import { AppConfigService } from '../config/app-config';
import { windDirectionLabel } from '../weather/weather-codes';
import { DailyHistory, RawDailyHistory, RawStationReading, StationReading } from './station.models';

/** Dati della stazione di Vanza letti da backend.php (stesso sito Altervista). */
@Service()
export class StationService {
  private readonly config = inject(AppConfigService).config;
  private readonly apiUrl = computed(() => this.config().station.apiUrl.replace(/\/+$/, ''));

  /** Rilevazione attuale. Chiamare weatherData aggiorna anche lo storico nel database. */
  readonly current = httpResource<StationReading>(
    () => (this.apiUrl() ? `${this.apiUrl()}/weatherData` : undefined),
    { parse: (raw) => mapStationReading(raw as RawStationReading) },
  );

  /** Temperature (e pioggia, se disponibile) degli ultimi 31 giorni. */
  readonly history = httpResource<DailyHistory[]>(
    () => (this.apiUrl() ? `${this.apiUrl()}/getTemps` : undefined),
    { parse: (raw) => mapDailyHistory(raw as RawDailyHistory[]) },
  );

  constructor() {
    const minutes = this.config().station.refreshMinutes;
    if (minutes > 0) {
      const timer = setInterval(() => this.current.reload(), minutes * 60_000);
      inject(DestroyRef).onDestroy(() => clearInterval(timer));
    }
  }
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Interpreta "YYYY-MM-DD HH:mm:ss" come ora locale. */
export function parseLocalDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value.trim().replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function windDirection(value: unknown): string | null {
  const degrees = toNumber(value);
  if (degrees !== null) return windDirectionLabel(degrees);
  const text = value == null ? '' : String(value).trim();
  return text ? text.toUpperCase() : null;
}

export function mapStationReading(raw: RawStationReading): StationReading {
  return {
    time: parseLocalDateTime(raw.observation_time_local),
    temperature: toNumber(raw.temperature),
    humidity: toNumber(raw.rh),
    dewPoint: toNumber(raw.dew_point),
    pressure: toNumber(raw.mslp),
    windSpeed: toNumber(raw.wind_speed),
    windGust: toNumber(raw.wind_gust),
    windDirection: windDirection(raw.wind_direction),
    rainRate: toNumber(raw.rain_rate),
    dailyRain: toNumber(raw.daily_rain),
    temperatureMin: toNumber(raw.current_tmin),
    temperatureMed: toNumber(raw.current_tmed),
    temperatureMax: toNumber(raw.current_tmax),
  };
}

export function mapDailyHistory(rows: RawDailyHistory[]): DailyHistory[] {
  return rows
    .map((row) => ({
      date: parseLocalDateTime(row.timestamp),
      min: toNumber(row.min_temp),
      med: toNumber(row.med_temp),
      max: toNumber(row.max_temp),
      rain: toNumber(row.daily_rain),
    }))
    .filter((row): row is DailyHistory => row.date !== null);
}
