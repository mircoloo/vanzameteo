export type VanzaScene = 'sole' | 'nuvoloso' | 'pioggia' | 'neve';

export interface WeatherCondition {
  label: string;
  icon: string;
  scene: VanzaScene;
}

const UNKNOWN: WeatherCondition = { label: 'Non disponibile', icon: '❔', scene: 'nuvoloso' };

/** Codici WMO restituiti da Open-Meteo (campo `weather_code`). */
const CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: 'Sereno', icon: '☀️', scene: 'sole' },
  1: { label: 'Prevalentemente sereno', icon: '🌤️', scene: 'sole' },
  2: { label: 'Parzialmente nuvoloso', icon: '⛅', scene: 'nuvoloso' },
  3: { label: 'Coperto', icon: '☁️', scene: 'nuvoloso' },
  45: { label: 'Nebbia', icon: '🌫️', scene: 'nuvoloso' },
  48: { label: 'Nebbia con brina', icon: '🌫️', scene: 'nuvoloso' },
  51: { label: 'Pioviggine leggera', icon: '🌦️', scene: 'pioggia' },
  53: { label: 'Pioviggine', icon: '🌦️', scene: 'pioggia' },
  55: { label: 'Pioviggine intensa', icon: '🌧️', scene: 'pioggia' },
  56: { label: 'Pioviggine gelata', icon: '🌧️', scene: 'pioggia' },
  57: { label: 'Pioviggine gelata intensa', icon: '🌧️', scene: 'pioggia' },
  61: { label: 'Pioggia debole', icon: '🌦️', scene: 'pioggia' },
  63: { label: 'Pioggia', icon: '🌧️', scene: 'pioggia' },
  65: { label: 'Pioggia forte', icon: '🌧️', scene: 'pioggia' },
  66: { label: 'Pioggia gelata', icon: '🌧️', scene: 'pioggia' },
  67: { label: 'Pioggia gelata forte', icon: '🌧️', scene: 'pioggia' },
  71: { label: 'Neve debole', icon: '🌨️', scene: 'neve' },
  73: { label: 'Neve', icon: '🌨️', scene: 'neve' },
  75: { label: 'Neve forte', icon: '❄️', scene: 'neve' },
  77: { label: 'Granuli di neve', icon: '🌨️', scene: 'neve' },
  80: { label: 'Rovesci deboli', icon: '🌦️', scene: 'pioggia' },
  81: { label: 'Rovesci', icon: '🌧️', scene: 'pioggia' },
  82: { label: 'Rovesci violenti', icon: '⛈️', scene: 'pioggia' },
  85: { label: 'Rovesci di neve', icon: '🌨️', scene: 'neve' },
  86: { label: 'Forti rovesci di neve', icon: '❄️', scene: 'neve' },
  95: { label: 'Temporale', icon: '⛈️', scene: 'pioggia' },
  96: { label: 'Temporale con grandine', icon: '⛈️', scene: 'pioggia' },
  99: { label: 'Temporale con forte grandine', icon: '⛈️', scene: 'pioggia' },
};

export function describeWeatherCode(code: number | null | undefined): WeatherCondition {
  return (code != null && CONDITIONS[code]) || UNKNOWN;
}

export function sceneImage(scene: VanzaScene): string {
  return `img/vanza/vanza_${scene}.webp`;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

/** Converte i gradi della direzione del vento in punto cardinale (italiano). */
export function windDirectionLabel(degrees: number): string {
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % COMPASS.length;
  return COMPASS[index];
}
