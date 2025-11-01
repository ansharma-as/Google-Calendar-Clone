import { RRule, RRuleSet, rrulestr } from 'rrule';
import { IEvent } from '../models/Event';

export interface ExpandedEvent {
  _id?: string;
  title: string;
  description?: string;
  location?: string;
  color?: string;
  allDay: boolean;
  start: Date;
  end: Date;
  isRecurring: boolean;
  recurringEventId?: string;
  reminders?: Array<{ minutesBefore: number; method: 'popup' | 'email' }>;
}

export const expandRecurringEvent = (
  event: IEvent,
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] => {
  if (!event.recurrence) {
    if (event.start <= rangeEnd && event.end >= rangeStart) {
      return [{
        _id: event._id.toString(),
        title: event.title,
        description: event.description,
        location: event.location,
        color: event.color,
        allDay: event.allDay,
        start: event.start,
        end: event.end,
        isRecurring: false,
        reminders: event.reminders,
      }];
    }
    return [];
  }

  let rrule: RRule;
  try {
    rrule = rrulestr(event.recurrence.rule) as RRule;
  } catch (error) {
    console.error('Failed to parse RRULE:', error);
    return [];
  }

  const occurrences = rrule.between(rangeStart, rangeEnd, true);

  const exdates = event.recurrence.exdates || [];
  const exdateStrings = exdates.map(d => d.toISOString().split('T')[0]);

  const duration = event.end.getTime() - event.start.getTime();

  const expandedEvents: ExpandedEvent[] = occurrences
    .filter(occurrence => {
      const occurrenceDate = occurrence.toISOString().split('T')[0];
      return !exdateStrings.includes(occurrenceDate);
    })
    .map(occurrence => {
      const occurrenceStart = new Date(occurrence);
      const occurrenceEnd = new Date(occurrence.getTime() + duration);

      return {
        _id: `${event._id.toString()}_${occurrence.toISOString()}`,
        title: event.title,
        description: event.description,
        location: event.location,
        color: event.color,
        allDay: event.allDay,
        start: occurrenceStart,
        end: occurrenceEnd,
        isRecurring: true,
        recurringEventId: event._id.toString(),
        reminders: event.reminders,
      };
    });

  return expandedEvents;
};

export const expandAllEvents = (
  events: IEvent[],
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] => {
  const expandedEvents: ExpandedEvent[] = [];

  for (const event of events) {
    const expanded = expandRecurringEvent(event, rangeStart, rangeEnd);
    expandedEvents.push(...expanded);
  }

  expandedEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

  return expandedEvents;
};

export const validateRRule = (ruleString: string): boolean => {
  try {
    rrulestr(ruleString);
    return true;
  } catch {
    return false;
  }
};
