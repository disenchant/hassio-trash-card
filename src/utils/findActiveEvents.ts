import { getDayFromDate } from './getDayFromDate';
import { getTimeZoneOffset } from './getTimeZoneOffset';
import { filterEventByPatterns } from './filterEventByPatterns';

import type { CalendarEvent } from './calendarEvents';
import type { CalendarEventTrackerConfig } from '../cards/calendar-event-tracker/calendar-event-tracker-config';

interface Config {
  pattern: Required<CalendarEventTrackerConfig>['pattern'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_events: CalendarEventTrackerConfig['filter_events'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  only_all_day_events: CalendarEventTrackerConfig['only_all_day_events'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  show_completed: CalendarEventTrackerConfig['show_completed'];
}

interface Options {
  config: Config;
  location?: string;
  now: Date;
  dropAfter: boolean;
  filterFutureEventsDay: string;
}

const isMatchingAnyPatterns = (item: CalendarEvent, config: Config) => {
  if (!config.filter_events) {
    return true;
  }

  const patterns = config.pattern.filter(pattern => pattern.pattern !== undefined);

  return patterns.length === 0 || patterns.some(pat => filterEventByPatterns(pat, item));
};

const isNotPastWholeDayEvent = (item: CalendarEvent, now: Date, dropAfter: boolean): boolean =>
  (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && !dropAfter) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now));

const findActiveEvents = (items: CalendarEvent[], { config, now, dropAfter, filterFutureEventsDay, location }: Options): CalendarEvent[] => {
  const dateString = `${filterFutureEventsDay}T00:00:00${getTimeZoneOffset()}`;
  const dateMaxStart = new Date(dateString);

  const activeItems = items.
    filter((item): boolean => {
      const isTask = item.content.entity?.startsWith('todo.');

      if (location && !item.content.location?.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      if (isTask) {
        if (!config.show_completed && item.content.status === 'completed') {
          return false;
        }

        if (item.date.start > dateMaxStart) {
          return false;
        }

        return true;
      }

      if (item.date.start > dateMaxStart) {
        return false;
      }

      if (config.only_all_day_events && !item.isWholeDayEvent) {
        return false;
      }

      if (item.isWholeDayEvent) {
        return item.date.end > now;
      }

      if (item.date.end < now) {
        if (getDayFromDate(item.date.end) === getDayFromDate(now) && !dropAfter) {
          return true;
        }

        return false;
      }

      return true;
    }).
    sort((first, second): number => first.date.start.getTime() - second.date.start.getTime());

  return activeItems.
    filter((item): boolean => {
      const isTask = item.content.entity?.startsWith('todo.');

      return isMatchingAnyPatterns(item, config) &&
        (isTask || isNotPastWholeDayEvent(item, now, dropAfter) || !item.isWholeDayEvent);
    });
};

export {
  findActiveEvents
};
