import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  stationName: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  weatherRefreshMinutes: number;
  webcam: {
    url: string;
    refreshSeconds: number;
  };
}

/** Valori usati se `config.json` manca o non è leggibile. */
export const DEFAULT_APP_CONFIG: AppConfig = {
  stationName: 'Vanzameteo',
  location: {
    name: 'Vanza (Trambileno, TN)',
    latitude: 45.8665,
    longitude: 11.0905,
    timezone: 'Europe/Rome',
  },
  weatherRefreshMinutes: 10,
  webcam: {
    url: 'https://vanzameteo.altervista.org/foicam/294e31d58d34c6b8/webcam.jpg',
    refreshSeconds: 60,
  },
};

/**
 * Configurazione letta a runtime da `config.json` (cartella `public/`).
 * Così coordinate, webcam e intervalli si cambiano sul server via FTP senza ricompilare.
 */
@Service()
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private readonly _config = signal<AppConfig>(DEFAULT_APP_CONFIG);

  readonly config = this._config.asReadonly();

  async load(): Promise<void> {
    try {
      const remote = await firstValueFrom(
        this.http.get<Partial<AppConfig>>('config.json', {
          headers: { 'Cache-Control': 'no-cache' },
        }),
      );
      this._config.set(mergeConfig(DEFAULT_APP_CONFIG, remote));
    } catch (err) {
      console.warn('config.json non disponibile, uso la configurazione di default', err);
    }
  }
}

export function mergeConfig(base: AppConfig, override: Partial<AppConfig> | null): AppConfig {
  if (!override) return base;
  return {
    ...base,
    ...override,
    location: { ...base.location, ...override.location },
    webcam: { ...base.webcam, ...override.webcam },
  };
}
