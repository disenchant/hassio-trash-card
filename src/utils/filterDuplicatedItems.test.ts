import { filterDuplicatedItems } from './filterDuplicatedItems';

import type { CalendarItem } from './calendarItem';

describe('filterDuplicatedItems', () => {
  const now = new Date();

  const createItem = (summary: string, pattern: string | undefined, idx: number, date: Date, max_items?: number): CalendarItem => ({
    content: {
      summary,
      uid: summary
    },
    date: {
      start: date,
      end: new Date(date.getTime() + 3_600_000)
    },
    isWholeDayEvent: false,
    label: summary,
    pattern,
    idx,
    max_items
  });

  test('groups fallbacks by summary', () => {
    const items = [
      createItem('Aoi Matsuri', undefined, 0, now),
      createItem('Alice Birthday', undefined, 0, new Date(now.getTime() + 86_400_000)),
      createItem('Aoi Matsuri', undefined, 0, new Date(now.getTime() + (86_400_000 * 2)))
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].content.summary).toBe('Aoi Matsuri');
    expect(result[1].content.summary).toBe('Alice Birthday');
  });

  test('does NOT group different patterns', () => {
    const items = [
      createItem('Karton', 'Karton', 0, now),
      createItem('Mobiler Recyclinghof', 'Mobiler', 2, new Date(now.getTime() + 86_400_000))
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].content.summary).toBe('Karton');
    expect(result[1].content.summary).toBe('Mobiler Recyclinghof');
  });

  test('groups same pattern (same idx)', () => {
    const items = [
      createItem('Karton 1', 'Karton', 0, now),
      createItem('Karton 2', 'Karton', 0, new Date(now.getTime() + 86_400_000))
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(1);
    expect(result[0].content.summary).toBe('Karton 1');
  });

  test('allows max_items for same pattern', () => {
    const items = [
      createItem('Birthday Alice', 'Birthday', 1, now, 2),
      createItem('Birthday Bob', 'Birthday', 1, new Date(now.getTime() + 86_400_000), 2),
      createItem('Birthday John', 'Birthday', 1, new Date(now.getTime() + (86_400_000 * 2)), 2)
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].content.summary).toBe('Birthday Alice');
    expect(result[1].content.summary).toBe('Birthday Bob');
  });
});

