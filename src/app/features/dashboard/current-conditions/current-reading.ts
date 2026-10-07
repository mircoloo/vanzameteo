import { StationReading } from '../../../core/station/station.models';
import { windDirectionLabel } from '../../../core/weather/weather-codes';
import { CurrentWeather } from '../../../core/weather/weather.models';

/** Dati mostrati nella card "Meteo attuale", dalla stazione o dal modello Open-Meteo. */
export interface CurrentReading {
  source: 'station' | 'model';
  time: Date | null;
  temperature: number | null;
  apparentTemperature: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  humidity: number | null;
  dewPoint: number | null;
  pressure: number | null;
  windSpeed: number | null;
  windGust: number | null;
  windDirection: string | null;
  rain: number | null;
  rainLabel: string;
  weatherCode: number | null;
}

/** Misure della stazione; dal modello prende solo il codice del cielo (sereno, pioggia…). */
export function readingFromStation(
  station: StationReading,
  model: CurrentWeather | null,
): CurrentReading {
  return {
    source: 'station',
    time: station.time,
    temperature: station.temperature,
    apparentTemperature: null,
    temperatureMin: station.temperatureMin,
    temperatureMax: station.temperatureMax,
    humidity: station.humidity,
    dewPoint: station.dewPoint,
    pressure: station.pressure,
    windSpeed: station.windSpeed,
    windGust: station.windGust,
    windDirection: station.windDirection,
    rain: station.dailyRain,
    rainLabel: 'Pioggia oggi',
    weatherCode: model?.weatherCode ?? null,
  };
}

export function readingFromModel(model: CurrentWeather): CurrentReading {
  return {
    source: 'model',
    time: model.time,
    temperature: model.temperature,
    apparentTemperature: model.apparentTemperature,
    temperatureMin: null,
    temperatureMax: null,
    humidity: model.humidity,
    dewPoint: null,
    pressure: model.pressure,
    windSpeed: model.windSpeed,
    windGust: model.windGusts,
    windDirection: windDirectionLabel(model.windDirection),
    rain: model.precipitation,
    rainLabel: 'Precipitazioni',
    weatherCode: model.weatherCode,
  };
}
