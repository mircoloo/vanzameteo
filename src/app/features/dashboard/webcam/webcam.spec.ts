import { isSafeUrl, withCacheBuster } from './webcam';

describe('withCacheBuster', () => {
  it('appends a time parameter', () => {
    expect(withCacheBuster('https://x/cam.jpg', 42)).toBe('https://x/cam.jpg?time=42');
    expect(withCacheBuster('https://x/cam.jpg?a=1', 42)).toBe('https://x/cam.jpg?a=1&time=42');
  });
});

describe('isSafeUrl', () => {
  it('accepts http(s) and site paths only', () => {
    expect(isSafeUrl('/foicam/areaprivata/video.php?code=x')).toBe(true);
    expect(isSafeUrl('https://example.org/a')).toBe(true);
    expect(isSafeUrl('//evil.example/a')).toBe(false);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
  });
});
