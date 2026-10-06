import { formatNumber } from '@angular/common';
import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { describeWeatherCode } from '../../../core/weather/weather-codes';
import { CurrentReading } from './current-reading';

interface Measurement {
  label: string;
  value: string;
}

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.html',
})
export class CurrentConditions {
  readonly reading = input.required<CurrentReading>();
  readonly stationUrl = input<string>();

  private readonly locale = inject(LOCALE_ID);

  protected readonly condition = computed(() => {
    const code = this.reading().weatherCode;
    return code === null ? null : describeWeatherCode(code);
  });

  protected readonly measurements = computed<Measurement[]>(() => {
    const r = this.reading();
    const value = (n: number | null, digits: string, unit: string) =>
      n === null ? null : `${this.format(n, digits)} ${unit}`;
    const wind = [value(r.windSpeed, '1.0-1', 'km/h'), r.windDirection].filter(Boolean).join(' ');

    const rows: [string, string | null][] = [
      ['Minima oggi', value(r.temperatureMin, '1.1-1', '°C')],
      ['Massima oggi', value(r.temperatureMax, '1.1-1', '°C')],
      ['Umidità', value(r.humidity, '1.0-0', '%')],
      ['Punto di rugiada', value(r.dewPoint, '1.1-1', '°C')],
      ['Vento', wind || null],
      ['Raffica', value(r.windGust, '1.0-1', 'km/h')],
      ['Pressione', value(r.pressure, '1.0-1', 'hPa')],
      [r.rainLabel, value(r.rain, '1.1-1', 'mm')],
    ];
    return rows
      .filter((row): row is [string, string] => row[1] !== null)
      .map(([label, text]) => ({ label, value: text }));
  });

  protected format(value: number, digits: string): string {
    return formatNumber(value, this.locale, digits);
  }
}
