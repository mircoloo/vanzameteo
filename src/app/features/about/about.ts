import { Component, inject } from '@angular/core';
import { AppConfigService } from '../../core/config/app-config';

@Component({
  selector: 'app-about',
  template: `
    <div class="container-md py-4">
      <div class="card card-dark">
        <div class="card-body">
          <h1 class="h3">Info su {{ config().stationName }}</h1>
          <p>
            {{ config().stationName }} mostra il meteo attuale, le previsioni dei prossimi giorni e
            la webcam live di {{ config().location.name }}.
          </p>
          <ul>
            <li>Coordinate: {{ config().location.latitude }}, {{ config().location.longitude }}</li>
            <li>
              Dati meteo forniti da
              <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>
              (licenza CC BY 4.0), aggiornati ogni {{ config().weatherRefreshMinutes }} minuti.
            </li>
            <li>
              Immagine della webcam aggiornata ogni {{ config().webcam.refreshSeconds }} secondi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class About {
  protected readonly config = inject(AppConfigService).config;
}
