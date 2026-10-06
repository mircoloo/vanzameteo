import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AppConfigService } from '../../core/config/app-config';
import { describeWeatherCode, sceneImage } from '../../core/weather/weather-codes';
import { WeatherService } from '../../core/weather/weather.service';
import { CurrentConditions } from './current-conditions/current-conditions';
import { DailyForecastList } from './daily-forecast/daily-forecast';
import { TemperatureChart } from './temperature-chart/temperature-chart';
import { Webcam } from './webcam/webcam';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, CurrentConditions, TemperatureChart, DailyForecastList, Webcam],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly weatherService = inject(WeatherService);

  protected readonly config = inject(AppConfigService).config;
  protected readonly weather = this.weatherService.weather;

  protected readonly heroImage = computed(() => {
    const code = this.weather.hasValue() ? this.weather.value().current.weatherCode : null;
    return sceneImage(describeWeatherCode(code).scene);
  });

  protected reload(): void {
    this.weatherService.reload();
  }
}
