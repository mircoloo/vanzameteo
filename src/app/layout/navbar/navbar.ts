import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppConfigService } from '../../core/config/app-config';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly config = inject(AppConfigService).config;
  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { path: '/', label: 'Meteo', exact: true },
    { path: '/info', label: 'Info', exact: false },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
