import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-webcam',
  imports: [DatePipe],
  templateUrl: './webcam.html',
  styleUrl: './webcam.css',
})
export class Webcam {
  readonly url = input.required<string>();
  readonly refreshSeconds = input(60);
  /** Pagina FoiCam con la sequenza delle foto; vuoto = clic apre solo l'immagine. */
  readonly slideshowUrl = input('');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  private readonly refreshedAt = signal(new Date());
  protected readonly failed = signal(false);
  protected readonly slideshowOpen = signal(false);
  protected readonly lastUpdate = this.refreshedAt.asReadonly();
  protected readonly src = computed(() =>
    withCacheBuster(this.url(), this.refreshedAt().getTime()),
  );
  protected readonly slideshowSrc = computed<SafeResourceUrl | null>(() => {
    const url = this.slideshowUrl();
    // L'URL arriva da config.json: accetta solo http(s) o percorsi del sito.
    return isSafeUrl(url) ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

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

  protected openSlideshow(): void {
    this.slideshowOpen.set(true);
    this.dialog()?.nativeElement.showModal();
  }

  protected closeSlideshow(): void {
    this.dialog()?.nativeElement.close();
  }

  /** Chiude cliccando sullo sfondo scuro fuori dalla finestra. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeSlideshow();
  }
}

/** Aggiunge un parametro `time` per evitare che il browser mostri l'immagine in cache. */
export function withCacheBuster(url: string, timestamp: number): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}time=${timestamp}`;
}

export function isSafeUrl(url: string): boolean {
  return /^(https?:\/\/|\/(?!\/))/i.test(url.trim());
}
