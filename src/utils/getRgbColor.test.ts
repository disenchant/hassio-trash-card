import { getRgbColor } from './getRgbColor';

describe('getRgbColor', () => {
  test('returns primary variable for "primary"', () => {
    expect(getRgbColor('primary')).toBe('var(--rgb-primary-color)');
  });

  test('returns accent variable for "accent"', () => {
    expect(getRgbColor('accent')).toBe('var(--rgb-accent-color)');
  });

  test('returns default variable for standard color', () => {
    expect(getRgbColor('red')).toBe('var(--rgb-red)');
  });

  test('returns RGB values for HEX color', () => {
    expect(getRgbColor('#ff0000')).toBe('255, 0, 0');
  });

  test('returns RGB values for HEX color (short format)', () => {
    expect(getRgbColor('#f00')).toBe('255, 0, 0');
  });

  test('returns RGB values for HEX color (with alpha)', () => {
    expect(getRgbColor('#ff0000ff')).toBe('255, 0, 0');
  });

  test('returns default variable if invalid HEX color is provided', () => {
    expect(getRgbColor('#invalid')).toBe('var(--rgb-#invalid)');
  });
});
