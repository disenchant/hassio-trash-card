import type { CalendarItem } from './calendarItem';

const filterDuplicatedItems = (items: CalendarItem[]): CalendarItem[] => {
  const seenCounts = new Map<string, number>();

  return items.filter(item => {
    const { idx, max_items, pattern } = item;
    const max = max_items ?? 1;

    let key = '';

    if (!pattern) {
      const { content } = item;

      key = `fallback-${content.recurrence_id ?? content.summary}`;
    } else {
      key = `pattern-${idx}`;
    }

    const currentCount = seenCounts.get(key) ?? 0;

    if (currentCount >= max) {
      return false;
    }

    seenCounts.set(key, currentCount + 1);

    return true;
  });
};

export {
  filterDuplicatedItems
};
