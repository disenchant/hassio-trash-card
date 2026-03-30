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

  test('falls back to others when no pattern matches and no others pattern defined', () => {
    const event = createEvent('Aoi Matsuri');
    const result = eventToItem(event, { pattern: [], useSummary: false });

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('others');
    expect(result[0].label).toBe('Aoi Matsuri');
    expect(result[0].icon).toBe('mdi:calendar');
  });

  test('uses defined others pattern when no other pattern matches', () => {
    const event = createEvent('Aoi Matsuri');
    const pattern = [
      { type: 'others', icon: 'mdi:custom-icon', label: 'My Others', pattern: 'something' }
    ];
    const result = eventToItem(event, { pattern: pattern as any, useSummary: false });

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('others');
    expect(result[0].label).toBe('My Others');
    expect(result[0].icon).toBe('mdi:custom-icon');
  });
});
