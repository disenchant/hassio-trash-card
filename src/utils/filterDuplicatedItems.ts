import type { CalendarItem } from './calendarItem';

const filterDuplicatedItems = (items: CalendarItem[]): CalendarItem[] => {
  const seenCounts = new Map<string, number>();

  return items.filter(item => {
    const { type, idx, max_items } = item;
    const max = max_items ?? 1;

    let key = '';

    if (type === 'others') {
      const { content } = item;

      key = `others-${content.recurrence_id ?? content.summary}`;
    } else {
      key = `${type}-${idx}`;
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
