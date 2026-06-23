import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-weather-dashboard',
  imports: [CommonModule],
  templateUrl: './weather-dashboard.html'
})
export class WeatherDashboard implements AfterViewInit {

  // dati meteo mock
  temperature = 22;
  condition = 'Parzialmente nuvoloso';
  humidity = 65;
  wind = 12;
  pressure = 1013;

  // immagine
  imageUrl: string | ArrayBuffer | null = null;

  // chart instance
  chart: any;

  ngAfterViewInit(): void {
    this.initChart();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl = reader.result;
    };

    reader.readAsDataURL(file);
  }

  initChart() {
    const ctx = document.getElementById('tempChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
        datasets: [
          {
            label: 'Temperatura °C',
            data: [18, 20, 19, 23, 25, 24, 22],
            borderWidth: 2,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }
}