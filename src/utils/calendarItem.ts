import type { CalendarEvent } from './calendarEvents';

interface CalendarItem extends CalendarEvent {
  label: string;
  color?: string;
  icon?: string;
  type?: string;
  picture?: string;
  pattern?: string;
  idx?: number;
  max_items?: number;
  task_interval?: number;
  uid?: string;
  summary?: string;
  entity?: string;
  status?: string;
}

export type {
  CalendarItem
};
