import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { describeWeatherCode, windDirectionLabel } from '../../../core/weather/weather-codes';
import { CurrentWeather } from '../../../core/weather/weather.models';

@Component({
  selector: 'app-current-conditions',
  imports: [DecimalPipe],
  templateUrl: './current-conditions.html',
})
export class CurrentConditions {
  readonly current = input.required<CurrentWeather>();

  protected readonly condition = computed(() => describeWeatherCode(this.current().weatherCode));
  protected readonly windFrom = computed(() => windDirectionLabel(this.current().windDirection));
}
