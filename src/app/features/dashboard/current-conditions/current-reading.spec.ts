import { StationReading } from '../../../core/station/station.models';
import { CurrentWeather } from '../../../core/weather/weather.models';
import { readingFromModel, readingFromStation } from './current-reading';

const MODEL: CurrentWeather = {
  time: new Date(2026, 9, 6, 21),
  temperature: 12,
  apparentTemperature: 10,
  humidity: 80,
  pressure: 1015,
  precipitation: 0.2,
  windSpeed: 5,
  windGusts: 12,
  windDirection: 90,
  weatherCode: 61,
  isDay: false,
};

const STATION: StationReading = {
  time: new Date(2026, 9, 6, 21, 30),
  temperature: 11.2,
  humidity: 87,
  dewPoint: 9.1,
  pressure: null,
  windSpeed: 3,
  windGust: null,
  windDirection: 'NNE',
  rainRate: 0,
  dailyRain: 1.4,
  temperatureMin: 8.3,
  temperatureMed: 12,
  temperatureMax: 17.9,
};

describe('current reading', () => {
  it('uses station measurements and only the sky condition from the model', () => {
    const r = readingFromStation(STATION, MODEL);
    expect(r.source).toBe('station');
    expect(r.temperature).toBe(11.2);
    expect(r.pressure).toBeNull();
    expect(r.rain).toBe(1.4);
    expect(r.weatherCode).toBe(61);
  });

  it('works without model data', () => {
    expect(readingFromStation(STATION, null).weatherCode).toBeNull();
  });

  it('falls back to the model', () => {
    const r = readingFromModel(MODEL);
    expect(r.source).toBe('model');
    expect(r.windDirection).toBe('E');
    expect(r.apparentTemperature).toBe(10);
  });
});
