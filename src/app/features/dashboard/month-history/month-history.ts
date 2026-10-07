import { DatePipe, DecimalPipe, formatDate, formatNumber } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  LOCALE_ID,
  signal,
  viewChild,
} from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DailyHistory } from '../../../core/station/station.models';
import { summarizeMonth } from './month-stats';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
);

type View = 'temperature' | 'rain';

const COLORS = {
  max: '#f43f5e',
  med: '#ffd700',
  min: '#38bdf8',
  band: 'rgba(255, 215, 0, 0.07)',
  rain: '#38bdf8',
  grid: 'rgba(255, 255, 255, 0.06)',
  tick: '#8a8a8a',
};

@Component({
  selector: 'app-month-history',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './month-history.html',
  styleUrl: './month-history.css',
})
export class MonthHistory {
  readonly days = input.required<DailyHistory[]>();

  protected readonly view = signal<View>('temperature');
  protected readonly stats = computed(() => summarizeMonth(this.days()));
  protected readonly hasRain = computed(() => this.days().some((d) => d.rain !== null));

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly locale = inject(LOCALE_ID);
  private chart?: Chart;

  constructor() {
    effect(() => {
      const view = this.hasRain() ? this.view() : 'temperature';
      this.chart?.destroy();
      this.chart = new Chart(this.canvas().nativeElement, this.buildConfig(view, this.days()));
    });
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private buildConfig(view: View, days: DailyHistory[]): ChartConfiguration {
    const labels = days.map((d) => formatDate(d.date, 'd MMM', this.locale));
    const fmt = (v: number) => formatNumber(v, this.locale, '1.1-1');
    const scales = (unit: string, beginAtZero: boolean) => ({
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: COLORS.tick, maxTicksLimit: 7, maxRotation: 0 },
      },
      y: {
        beginAtZero,
        grid: { color: COLORS.grid },
        border: { display: false },
        ticks: {
          color: COLORS.tick,
          maxTicksLimit: 6,
          callback: (v: string | number) => `${v}${unit}`,
        },
      },
    });
    const tooltip = {
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      usePointStyle: true,
    };

    if (view === 'rain') {
      return {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Pioggia',
              data: days.map((d) => d.rain),
              backgroundColor: COLORS.rain,
              borderRadius: 4,
              maxBarThickness: 14,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: { ...tooltip, callbacks: { label: (ctx) => ` ${fmt(ctx.parsed.y ?? 0)} mm` } },
          },
          scales: scales(' mm', true),
        },
      };
    }

    const line = (label: string, key: 'max' | 'med' | 'min', width: number) => ({
      label,
      data: days.map((d) => d[key]),
      borderColor: COLORS[key],
      backgroundColor: COLORS[key],
      borderWidth: width,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.35,
      spanGaps: true,
    });

    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          // La fascia colorata tra massima e minima rende leggibile l'escursione giornaliera.
          { ...line('Massima', 'max', 1.5), fill: '+1', backgroundColor: COLORS.band },
          line('Minima', 'min', 1.5),
          line('Media', 'med', 2.5),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            ...tooltip,
            itemSort: (a, b) => (b.parsed.y ?? 0) - (a.parsed.y ?? 0),
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y ?? 0)} °C` },
          },
        },
        scales: scales('°', false),
      },
    };
  }
}
