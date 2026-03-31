import { eventToItem } from './eventsToItems';

import type { CalendarEvent } from './calendarEvents';

describe('eventToItem', () => {
  const now = new Date();

  const createEvent = (summary: string): CalendarEvent => ({
    content: {
      summary,
      uid: summary
    },
    date: {
      start: now,
      end: new Date(now.getTime() + 3_600_000)
    },
    isWholeDayEvent: false
  });

  test('falls back to generic pattern when no pattern matches and no fallback pattern defined', () => {
    const event = createEvent('Aoi Matsuri');
    const result = eventToItem(event, { pattern: [], useSummary: false });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Aoi Matsuri');
    expect(result[0].icon).toBe('mdi:calendar');
  });

  test('uses defined fallback pattern when no other pattern matches', () => {
    const event = createEvent('Aoi Matsuri');
    const pattern = [
      { icon: 'mdi:custom-icon', label: 'My Fallback' }
    ];
    const result = eventToItem(event, { pattern: pattern as any, useSummary: false });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('My Fallback');
    expect(result[0].icon).toBe('mdi:custom-icon');
  });
});
