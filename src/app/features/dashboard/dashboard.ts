import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AppConfigService } from '../../core/config/app-config';
import { StationService } from '../../core/station/station.service';
import { describeWeatherCode, sceneImage } from '../../core/weather/weather-codes';
import { WeatherService } from '../../core/weather/weather.service';
import { CurrentConditions } from './current-conditions/current-conditions';
import { readingFromModel, readingFromStation } from './current-conditions/current-reading';
import { DailyForecastList } from './daily-forecast/daily-forecast';
import { HistoryChart } from './history-chart/history-chart';
import { TemperatureChart } from './temperature-chart/temperature-chart';
import { Webcam } from './webcam/webcam';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, CurrentConditions, TemperatureChart, HistoryChart, DailyForecastList, Webcam],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly weatherService = inject(WeatherService);
  private readonly stationService = inject(StationService);

  protected readonly config = inject(AppConfigService).config;
  protected readonly weather = this.weatherService.weather;
  protected readonly station = this.stationService.current;
  protected readonly history = this.stationService.history;

  private readonly model = computed(() =>
    this.weather.hasValue() ? this.weather.value().current : null,
  );

  /** Dati della stazione se disponibili, altrimenti la stima Open-Meteo. */
  protected readonly reading = computed(() => {
    if (this.station.hasValue()) return readingFromStation(this.station.value(), this.model());
    const model = this.model();
    return model ? readingFromModel(model) : null;
  });

  /** Mentre la stazione risponde ancora non mostra la stima del modello. */
  protected readonly waitingForStation = computed(
    () => this.station.isLoading() && !this.station.hasValue(),
  );

  protected readonly heroImage = computed(() =>
    sceneImage(describeWeatherCode(this.model()?.weatherCode).scene),
  );

  protected readonly noData = computed(() => !!this.weather.error() && !this.station.hasValue());

  protected reload(): void {
    this.weatherService.reload();
    this.station.reload();
  }
}
