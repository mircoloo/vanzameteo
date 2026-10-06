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
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DailyTemperatures } from '../../../core/station/station.models';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
  Tooltip,
);

const SERIES = [
  { key: 'max', label: 'Massima', color: '#f43f5e' },
  { key: 'med', label: 'Media', color: '#ffd700' },
  { key: 'min', label: 'Minima', color: '#38bdf8' },
] as const;

@Component({
  selector: 'app-history-chart',
  template: `
    <div class="card card-dark">
      <div class="card-body">
        <h2 class="h5 card-title text-body-secondary">
          Temperature ultimi {{ days().length }} giorni
        </h2>
        <div class="chart-box">
          <canvas
            #canvas
            aria-label="Grafico temperature giornaliere della stazione"
            role="img"
          ></canvas>
        </div>
      </div>
    </div>
  `,
  styles: `
    .chart-box {
      position: relative;
      height: 260px;
    }
  `,
})
export class HistoryChart {
  readonly days = input.required<DailyTemperatures[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly locale = inject(LOCALE_ID);
  private chart?: Chart<'line', (number | null)[]>;

  constructor() {
    effect(() => this.render(this.days()));
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private render(days: DailyTemperatures[]): void {
    const labels = days.map((d) => formatDate(d.date, 'd MMM', this.locale));
    const datasets = SERIES.map((s) => ({
      label: s.label,
      data: days.map((d) => d[s.key]),
      borderColor: s.color,
      backgroundColor: s.color,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.35,
      spanGaps: true,
    }));

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets = datasets;
      this.chart.update();
      return;
    }

    this.chart = new Chart(this.canvas().nativeElement, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#ccc', usePointStyle: true, boxWidth: 8 } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} °C` } },
        },
        scales: {
          x: { ticks: { color: '#aaa', maxTicksLimit: 8 }, grid: { color: '#222' } },
          y: { ticks: { color: '#aaa', callback: (v) => `${v}°` }, grid: { color: '#222' } },
        },
      },
    });
  }
}
