export interface CurrentWeather {
  time: Date;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  pressure: number;
  precipitation: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyPoint {
  time: Date;
  temperature: number;
  precipitationProbability: number;
}

export interface DailyForecast {
  date: Date;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
}

export interface WeatherSnapshot {
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyForecast[];
}

/** Sottoinsieme della risposta di https://open-meteo.com/en/docs usato dall'app. */
export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    pressure_msl: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}
