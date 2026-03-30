jest.mock('lit', () => ({
  css: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  unsafeCSS: jest.fn()
}));

jest.mock('./defaultHaCardStyle', () => ({
  colors: {
    disabled: '189, 189, 189',
    red: '244, 67, 54'
  },
  defaultHaCardStyle: {}
}));

import { getColoredStyle } from './getColoredStyle';
import { CalendarItem } from './calendarItem';

describe('getColoredStyle', () => {
  const item: CalendarItem = {
    color: '#ff0000',
    type: 'test',
    label: 'Test Item',
    date: {
        start: new Date()
    }
  };

  test('returns correct style for HEX color in icon mode', () => {
    const style = getColoredStyle('icon', item);
    expect(style['--tile-color']).toBe('rgba(255, 0, 0)');
    expect(style['--icon-color']).toBe('rgba(255, 0, 0)');
    expect(style['--badge-color']).toBe('rgba(255, 0, 0)');
  });

  test('returns correct style for HEX color in background mode', () => {
    const style = getColoredStyle('background', item);
    expect(style['--ha-card-background']).toBe('rgba(255, 0, 0, 1)');
  });

  test('returns correct style for HEX color in badge mode', () => {
    const style = getColoredStyle('badge', item);
    expect(style['--icon-primary-color']).toBe('rgba(255, 0, 0)');
    expect(style['--badge-color']).toBe('rgba(255, 0, 0)');
  });

  test('handles multiple color modes', () => {
    const style = getColoredStyle(['icon', 'background'], item);
    expect(style['--tile-color']).toBe('rgb(var(--rgb-dark-grey))');
    expect(style['--ha-card-background']).toBe('rgba(255, 0, 0, 1)');
  });

  test('falls back to disabled color if item has no color', () => {
    const style = getColoredStyle('icon', { ...item, color: undefined });
    expect(style['--icon-color']).toBe('rgba(var(--rgb-disabled))');
  });
});
