import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfMonth, endOfMonth } from 'date-fns';
import CalendarHeader from '../components/CalendarHeader';
import CalendarGrid from '../components/CalendarGrid';
import EventModal from '../components/EventModal';
import Sidebar from '../components/Sidebar';
import { fetchEvents, selectEvent } from '../store/slices/eventsSlice';
import { useTheme } from '../context/ThemeContext';
import FullPageLoader from '../components/FullPageLoader';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalVariant, setModalVariant] = useState('quick');
  const [modalAnchor, setModalAnchor] = useState(null);
  const dispatch = useDispatch();
  const { events, selectedEvent, loading } = useSelector((state) => state.events);
  const { isDark } = useTheme();

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = () => {
    const start = startOfMonth(currentDate).toISOString();
    const end = endOfMonth(currentDate).toISOString();
    dispatch(fetchEvents({ start, end }));
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleCreateEvent = () => {
    dispatch(selectEvent(null));
    setSelectedDate(new Date());
    setModalVariant('quick');
    setModalAnchor(null);
    setIsModalOpen(true);
  };

  const handleDayClick = (date, anchorPosition) => {
    dispatch(selectEvent(null));
    setSelectedDate(date);
    setModalVariant('quick');
    setModalAnchor(anchorPosition || null);
    setIsModalOpen(true);
  };

  const handleDayDoubleClick = (date) => {
    dispatch(selectEvent(null));
    setSelectedDate(date);
    setModalVariant('full');
    setModalAnchor(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event, anchorPosition) => {
    dispatch(selectEvent(event));
    setSelectedDate(new Date(event.start));
    setModalVariant('quick');
    setModalAnchor(anchorPosition || null);
    setIsModalOpen(true);
  };

  const handleEventDoubleClick = (event) => {
    dispatch(selectEvent(event));
    setSelectedDate(new Date(event.start));
    setModalVariant('full');
    setModalAnchor(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setModalVariant('quick');
    setModalAnchor(null);
    loadEvents();
  };

  const handleExpandModal = () => {
    setModalVariant('full');
    setModalAnchor(null);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (loading && !events.length) {
    return <FullPageLoader />;
  }

  return (
    <div className={`h-screen flex flex-col shadow-xl ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <CalendarHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onCreateEvent={handleCreateEvent}
          currentDate={currentDate}
          onDateChange={handleDateChange}
          isCollapsed={isSidebarCollapsed}
        />
        <div className="flex-1 flex flex-col overflow-hidden md:pl-4 pb-3">
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onDayDoubleClick={handleDayDoubleClick}
            onEventClick={handleEventClick}
            onEventDoubleClick={handleEventDoubleClick}
          />
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        editEvent={selectedEvent}
        variant={modalVariant}
        anchorPosition={modalAnchor}
        onExpand={handleExpandModal}
      />
    </div>
  );
};

export default Calendar;
