import { useState } from 'react';
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
  addMonths,
  subMonths,
} from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ onCreateEvent, currentDate, onDateChange, isCollapsed }) => {
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const { isDark } = useTheme();

  const handlePrevMonth = () => {
    setMiniCalendarDate(subMonths(miniCalendarDate, 1));
  };

  const handleNextMonth = () => {
    setMiniCalendarDate(addMonths(miniCalendarDate, 1));
  };

  const renderMiniCalendar = () => {
    const monthStart = startOfMonth(miniCalendarDate);
    const monthEnd = endOfMonth(miniCalendarDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <div className={`rounded-lg p-2 transition-all duration-200 ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}>
        {/* Mini Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-medium transition-all duration-200 ${isDark ? 'text-neutral-100' : 'text-gray-900'}`}>
            {format(miniCalendarDate, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className={`p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95 ${isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronLeft className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={handleNextMonth}
              className={`p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95 ${isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`text-center text-[10px] font-light ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, miniCalendarDate);
            const isCurrentDay = isToday(day);
            const isSelected = isSameDay(day, currentDate);

            return (
              <button
                key={index}
                onClick={() => onDateChange(day)}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full text-xs
                  transform transition-all duration-200 hover:scale-110 active:scale-95
                  ${!isCurrentMonth ? (isDark ? 'text-neutral-500' : 'text-gray-400') : (isDark ? 'text-neutral-200' : 'text-gray-900')}
                  ${isCurrentDay && !isSelected ? 'bg-blue-600 text-white font-semibold shadow-md' : ''}
                  ${isSelected ? 'bg-blue-600 text-white font-semibold shadow-lg scale-110' : ''}
                  ${!isCurrentDay && !isSelected ? (isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-100') : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <aside className={`absolute top-20 left-6 w-14 h-14 rounded-xl flex flex-col items-center shadow-2xl transition-all duration-300 transform hover:scale-110 ${isDark ? 'bg-neutral-800 border-neutral-700 shadow-neutral-900' : 'bg-white border-gray-200 shadow-gray-300'}`}>
        <button
          onClick={onCreateEvent}
          className={`absolute rounded-xl w-full h-full flex items-center justify-center transition-all duration-200 ${isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-white hover:bg-gray-50'}`}
        >
          <Plus className={`w-6 h-6 transition-transform duration-200 hover:rotate-90 ${isDark ? 'text-white' : 'text-gray-600'}`} />
        </button>
      </aside>
    );
  }

  return (
    <aside className={`w-64 p-4 flex flex-col transform transition-all duration-300 ease-in-out ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}>
      {/* Create Button */}
      <button
        onClick={onCreateEvent}
        className={`flex w-36 text-sm items-center mb-6 px-3 py-1 border rounded-3xl shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
      >
        <div className={`w-12 h-12 flex items-center justify-center ${isDark ? ' border-neutral-700' : ' border-white'}`}>
          <Plus className={`w-5 h-5 transition-transform duration-200 group-hover:rotate-90 ${isDark ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <span className={`text-sm font-medium ${isDark ? 'text-neutral-200' : 'text-gray-700'}`}>Create</span>
      </button>

      {/* Mini Calendar */}
      {renderMiniCalendar()}

      {/* My Calendars */}
      <div className="mt-6">
        <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-neutral-100' : 'text-gray-900'}`}>My calendars</h3>
        <div className="space-y-2">
          <label className={`flex items-center space-x-2 cursor-pointer px-2 py-1 rounded transition-all duration-200 hover:scale-105 ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
            />
            <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>Events</span>
          </label>
          <label className={`flex items-center space-x-2 cursor-pointer px-2 py-1 rounded transition-all duration-200 hover:scale-105 ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-50'}`}>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
            />
            <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>Reminders</span>
          </label>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className={`${isDark ? 'bg-neutral-800' : 'bg-gray-200'}`} />
        <a
          href="https://github.com/ansharma-as"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center space-x-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
            isDark ? 'text-neutral-300 hover:bg-neutral-800' : 'text-gray-700 hover:bg-white'
          }`}
        >
            <Github className="w-5 h-5 transition-transform duration-200 hover:rotate-12" />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
