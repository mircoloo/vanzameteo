import { describeWeatherCode, sceneImage, windDirectionLabel } from './weather-codes';

describe('weather codes', () => {
  it('maps WMO codes to the vanza scenes', () => {
    expect(describeWeatherCode(0).scene).toBe('sole');
    expect(describeWeatherCode(3).scene).toBe('nuvoloso');
    expect(describeWeatherCode(63).scene).toBe('pioggia');
    expect(describeWeatherCode(95).scene).toBe('pioggia');
    expect(describeWeatherCode(73).scene).toBe('neve');
  });

  it('falls back for unknown codes', () => {
    expect(describeWeatherCode(1234).label).toBe('Non disponibile');
    expect(describeWeatherCode(null).label).toBe('Non disponibile');
  });

  it('builds image paths', () => {
    expect(sceneImage('neve')).toBe('img/vanza/vanza_neve.webp');
  });

  it('converts wind degrees to compass points', () => {
    expect(windDirectionLabel(0)).toBe('N');
    expect(windDirectionLabel(359)).toBe('N');
    expect(windDirectionLabel(90)).toBe('E');
    expect(windDirectionLabel(225)).toBe('SO');
    expect(windDirectionLabel(-90)).toBe('O');
  });
});
