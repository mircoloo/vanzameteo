import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DailyWeatherData } from './services/daily-weather-data';
import { WeatherDashboard } from './weather-dashboard/weather-dashboard';
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, WeatherDashboard, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private dailyWeatherDataService: DailyWeatherData){}
  protected readonly title = signal('vanzameteo-angular');
  color = signal("green")
  class = signal(false);
  
  ciao(){
    
  }
}
