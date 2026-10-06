import { DatePipe } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-webcam',
  imports: [DatePipe],
  templateUrl: './webcam.html',
})
export class Webcam {
  readonly url = input.required<string>();
  readonly refreshSeconds = input(60);

  private readonly refreshedAt = signal(new Date());
  protected readonly failed = signal(false);
  protected readonly lastUpdate = this.refreshedAt.asReadonly();
  protected readonly src = computed(() =>
    withCacheBuster(this.url(), this.refreshedAt().getTime()),
  );

  constructor() {
    effect((onCleanup) => {
      const seconds = this.refreshSeconds();
      if (seconds <= 0) return;
      const timer = setInterval(() => this.refresh(), seconds * 1000);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected refresh(): void {
    this.failed.set(false);
    this.refreshedAt.set(new Date());
  }
}

/** Aggiunge un parametro `time` per evitare che il browser mostri l'immagine in cache. */
export function withCacheBuster(url: string, timestamp: number): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}time=${timestamp}`;
}
