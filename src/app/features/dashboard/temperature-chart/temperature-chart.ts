import { formatDate } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  LOCALE_ID,
  viewChild,
} from '@angular/core';
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { HourlyPoint } from '../../../core/weather/weather.models';

// Registrazione selettiva: riduce il bundle rispetto a 'chart.js/auto'.
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
);

const ACCENT = '#ffd700';

@Component({
  selector: 'app-temperature-chart',
  template: `
    <div class="card card-dark">
      <div class="card-body">
        <h2 class="h5 card-title text-body-secondary">Temperatura prossime 24 ore</h2>
        <div class="chart-box">
          <canvas #canvas aria-label="Grafico temperatura prossime 24 ore" role="img"></canvas>
        </div>
      </div>
    </div>
  `,
  styles: `
    .chart-box {
      position: relative;
      height: 220px;
    }
  `,
})
export class TemperatureChart {
  readonly points = input.required<HourlyPoint[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly locale = inject(LOCALE_ID);
  private chart?: Chart<'line'>;

  constructor() {
    effect(() => this.render(this.points()));
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private render(points: HourlyPoint[]): void {
    const labels = points.map((p) => formatDate(p.time, 'HH:mm', this.locale));
    const data = points.map((p) => p.temperature);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
      return;
    }

    this.chart = new Chart(this.canvas().nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperatura °C',
            data,
            borderColor: ACCENT,
            backgroundColor: 'rgba(255, 215, 0, 0.12)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y} °C` } },
        },
        scales: {
          x: { ticks: { color: '#aaa', maxTicksLimit: 8 }, grid: { color: '#222' } },
          y: { ticks: { color: '#aaa', callback: (v) => `${v}°` }, grid: { color: '#222' } },
        },
      },
    });
  }
}
