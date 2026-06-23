import { TestBed } from '@angular/core/testing';

import { DailyWeatherData } from './daily-weather-data';

describe('DailyWeatherData', () => {
  let service: DailyWeatherData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyWeatherData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
