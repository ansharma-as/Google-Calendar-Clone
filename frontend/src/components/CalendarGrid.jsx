import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const CalendarGrid = ({
  currentDate,
  events,
  onDayClick,
  onDayDoubleClick,
  onEventClick,
  onEventDoubleClick,
}) => {
  const { isDark } = useTheme();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (date) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.start);
      return isSameDay(eventStart, date);
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const buildAnchorPosition = (target) => {
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    const scrollX =
      typeof window !== 'undefined' ? window.scrollX || window.pageXOffset : 0;
    const scrollY =
      typeof window !== 'undefined' ? window.scrollY || window.pageYOffset : 0;
    return {
      left: rect.left + scrollX,
      top: rect.top + scrollY,
      width: rect.width,
      height: rect.height,
    };
  };

  const renderDay = (date) => {
    const dayEvents = getEventsForDay(date);
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isCurrentDay = isToday(date);

    return (
      <div
        key={date.toString()}
        onClick={(event) => onDayClick && onDayClick(date, buildAnchorPosition(event.currentTarget))}
        onDoubleClick={(event) =>
          onDayDoubleClick && onDayDoubleClick(date, buildAnchorPosition(event.currentTarget))
        }
        className={`min-h-[8rem] border-r border-b cursor-pointer transition-colors ${
          isDark
            ? `border-neutral-700 ${!isCurrentMonth ? 'bg-neutral-950' : 'bg-neutral-950'} hover:bg-neutral-800`
            : `border-gray-200 ${!isCurrentMonth ? 'bg-white' : 'bg-white'} hover:bg-blue-50`
        } px-1 pt-2 pb-1`}
      >
        <div className="flex justify-center mb-1">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
              isCurrentDay
                ? 'bg-blue-400 text-gray-800'
                : isCurrentMonth
                ? isDark
                  ? 'text-neutral-300 hover:bg-neutral-700'
                  : 'text-gray-700 hover:bg-gray-100'
                : isDark
                ? 'text-neutral-500'
                : 'text-gray-400'
            }`}
          >
            {format(date, 'd')}
          </span>
        </div>
        <div className="space-y-0.5 overflow-y-auto max-h-20">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event._id}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick && onEventClick(event, buildAnchorPosition(e.currentTarget));
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onEventDoubleClick && onEventDoubleClick(event, buildAnchorPosition(e.currentTarget));
              }}
              className="px-1.5 py-0.5 text-xs rounded truncate cursor-pointer hover:shadow-md transition-shadow"
              style={{
                backgroundColor: event.color || '#3b82f6',
                color: 'white',
              }}
              title={event.title}
            >
              {event.allDay ? (
                <span className="font-medium">{event.title}</span>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className="font-medium">
                    {format(parseISO(event.start), 'h:mma')}
                  </span>
                  <span className="truncate">{event.title}</span>
                </div>
              )}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className={`px-1.5 py-0.5 text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-gray-600'}`}>
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex-1 overflow-hidden rounded-3xl border ${
        isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-gray-200 shadow-xl'
      }`}
    >
      <div className="grid grid-cols-7">
        {weekDays.map((dayLabel) => (
          <div
            key={dayLabel}
            className={`px-2 pt-2 text-center text-[10px] font-medium uppercase tracking-wider ${
              isDark ? 'text-neutral-300 bg-neutral-950' : 'text-gray-600 bg-white'
            }`}
          >
            {dayLabel}
          </div>
        ))}
        {days.map((dayDate) => renderDay(dayDate))}
      </div>
    </div>
  );
};

export default CalendarGrid;
