/** Ultima rilevazione della stazione (MeteoNetwork, tramite backend.php). */
export interface StationReading {
  time: Date | null;
  temperature: number | null;
  humidity: number | null;
  dewPoint: number | null;
  pressure: number | null;
  windSpeed: number | null;
  windGust: number | null;
  windDirection: string | null;
  rainRate: number | null;
  dailyRain: number | null;
  temperatureMin: number | null;
  temperatureMed: number | null;
  temperatureMax: number | null;
}

/** Riga dello storico giornaliero (`backend.php/getTemps`). */
export interface DailyTemperatures {
  date: Date;
  min: number | null;
  med: number | null;
  max: number | null;
}

/** Valori come arrivano da MeteoNetwork: numeri spesso serializzati come stringhe. */
type RawValue = string | number | null | undefined;

export interface RawStationReading {
  observation_time_local?: string;
  temperature?: RawValue;
  rh?: RawValue;
  dew_point?: RawValue;
  mslp?: RawValue;
  wind_speed?: RawValue;
  wind_gust?: RawValue;
  wind_direction?: RawValue;
  rain_rate?: RawValue;
  daily_rain?: RawValue;
  current_tmin?: RawValue;
  current_tmed?: RawValue;
  current_tmax?: RawValue;
}

export interface RawDailyTemperatures {
  timestamp: string;
  min_temp?: RawValue;
  med_temp?: RawValue;
  max_temp?: RawValue;
}
