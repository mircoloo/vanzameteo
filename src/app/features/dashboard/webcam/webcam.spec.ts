import { withCacheBuster } from './webcam';

describe('withCacheBuster', () => {
  it('appends a time parameter', () => {
    expect(withCacheBuster('https://x/cam.jpg', 42)).toBe('https://x/cam.jpg?time=42');
    expect(withCacheBuster('https://x/cam.jpg?a=1', 42)).toBe('https://x/cam.jpg?a=1&time=42');
  });
});
