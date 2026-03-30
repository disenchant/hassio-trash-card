import { filterDuplicatedItems } from './filterDuplicatedItems';

import type { CalendarItem } from './calendarItem';

describe('filterDuplicatedItems', () => {
  const now = new Date();

  const createItem = (summary: string, type: any, idx: number, date: Date, max_items?: number): CalendarItem => ({
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
    type,
    idx,
    max_items
  });

  test('groups others by summary', () => {
    const items = [
      createItem('Aoi Matsuri', 'others', 0, now),
      createItem('Alice Birthday', 'others', 0, new Date(now.getTime() + 86_400_000)),
      createItem('Aoi Matsuri', 'others', 0, new Date(now.getTime() + (86_400_000 * 2)))
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].content.summary).toBe('Aoi Matsuri');
    expect(result[1].content.summary).toBe('Alice Birthday');
  });

  test('does NOT group different patterns of same type', () => {
    const items = [
      createItem('Karton', 'recycle', 0, now),
      createItem('Mobiler Recyclinghof', 'recycle', 2, new Date(now.getTime() + 86_400_000))
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].content.summary).toBe('Karton');
    expect(result[1].content.summary).toBe('Mobiler Recyclinghof');
  });

  test('groups same pattern of same type', () => {
    const items = [
      createItem('Karton 1', 'recycle', 0, now),
      createItem('Karton 2', 'recycle', 0, new Date(now.getTime() + 86_400_000))
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(1);
    expect(result[0].content.summary).toBe('Karton 1');
  });

  test('allows max_items for same pattern', () => {
    const items = [
      createItem('Birthday Elena', 'custom', 1, now, 2),
      createItem('Birthday Sven', 'custom', 1, new Date(now.getTime() + 86_400_000), 2),
      createItem('Birthday John', 'custom', 1, new Date(now.getTime() + (86_400_000 * 2)), 2)
    ];

    const result = filterDuplicatedItems(items);

    expect(result).toHaveLength(2);
    expect(result[0].content.summary).toBe('Birthday Elena');
    expect(result[1].content.summary).toBe('Birthday Sven');
  });
});

