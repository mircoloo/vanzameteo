import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { describeWeatherCode } from '../../../core/weather/weather-codes';
import { DailyForecast } from '../../../core/weather/weather.models';

@Component({
  selector: 'app-daily-forecast',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './daily-forecast.html',
  styleUrl: './daily-forecast.css',
})
export class DailyForecastList {
  readonly days = input.required<DailyForecast[]>();

  protected readonly describe = describeWeatherCode;
}
