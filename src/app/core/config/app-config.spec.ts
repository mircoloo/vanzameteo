import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigService, DEFAULT_APP_CONFIG } from './app-config';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppConfigService);
    http = TestBed.inject(HttpTestingController);
  });

  it('merges config.json over the defaults', async () => {
    const loading = service.load();
    http.expectOne('config.json').flush({ location: { latitude: 1, longitude: 2 } });
    await loading;

    expect(service.config().location.latitude).toBe(1);
    expect(service.config().location.timezone).toBe(DEFAULT_APP_CONFIG.location.timezone);
    expect(service.config().webcam).toEqual(DEFAULT_APP_CONFIG.webcam);
  });

  it('keeps the defaults when config.json is missing', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const loading = service.load();
    http.expectOne('config.json').flush('', { status: 404, statusText: 'Not Found' });
    await loading;

    expect(service.config()).toEqual(DEFAULT_APP_CONFIG);
  });
});
