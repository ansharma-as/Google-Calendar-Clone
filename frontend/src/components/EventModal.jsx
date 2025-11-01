import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { X, Clock, MapPin, AlignLeft, Bell, Trash2, Save } from 'lucide-react';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  clearSelectedEvent,
} from '../store/slices/eventsSlice';
import { useTheme } from '../context/ThemeContext';

const QUICK_CARD_WIDTH = 380;
const QUICK_ESTIMATED_HEIGHT = 460;

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  editEvent,
  variant = 'quick',
  anchorPosition,
  onExpand,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.events);
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start: '',
    end: '',
    allDay: false,
    color: '#3b82f6',
    reminders: [],
  });
  const [reminderMinutes, setReminderMinutes] = useState('10');
  const [quickPosition, setQuickPosition] = useState(null);
  const quickCardRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editEvent) {
      const startDate = new Date(editEvent.start);
      const endDate = new Date(editEvent.end);

      setFormData({
        title: editEvent.title || '',
        description: editEvent.description || '',
        location: editEvent.location || '',
        start: format(startDate, "yyyy-MM-dd'T'HH:mm"),
        end: format(endDate, "yyyy-MM-dd'T'HH:mm"),
        allDay: editEvent.allDay || false,
        color: editEvent.color || '#3b82f6',
        reminders: editEvent.reminders || [],
      });
    } else if (selectedDate) {
      const startDate = new Date(selectedDate);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(10, 0, 0, 0);

      setFormData({
        title: '',
        description: '',
        location: '',
        start: format(startDate, "yyyy-MM-dd'T'HH:mm"),
        end: format(endDate, "yyyy-MM-dd'T'HH:mm"),
        allDay: false,
        color: '#3b82f6',
        reminders: [],
      });
    }
  }, [editEvent, selectedDate, isOpen]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddReminder = () => {
    if (!reminderMinutes) return;
    setFormData((prev) => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        {
          minutesBefore: parseInt(reminderMinutes, 10),
          method: 'popup',
        },
      ],
    }));
    setReminderMinutes('10');
  };

  const handleRemoveReminder = (index) => {
    setFormData((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eventPayload = {
      ...formData,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
    };

    if (editEvent) {
      await dispatch(updateEvent({ id: editEvent._id, data: eventPayload }));
    } else {
      await dispatch(createEvent(eventPayload));
    }

    handleClose();
  };

  const handleDelete = async () => {
    if (editEvent && window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteEvent(editEvent._id));
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      start: '',
      end: '',
      allDay: false,
      color: '#3b82f6',
      reminders: [],
    });
    setReminderMinutes('10');
    dispatch(clearSelectedEvent());
    onClose();
  };

  const computeBaseQuickPosition = () => {
    if (typeof window === 'undefined') {
      return { top: 0, left: 0 };
    }

    const margin = 16;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left;
    let top;

    if (anchorPosition) {
      left = anchorPosition.left + anchorPosition.width / 2 - QUICK_CARD_WIDTH / 2;
      top = anchorPosition.top + anchorPosition.height + 12;
    } else {
      left = scrollX + (viewportWidth - QUICK_CARD_WIDTH) / 2;
      top = scrollY + (viewportHeight - QUICK_ESTIMATED_HEIGHT) / 2;
    }

    left = Math.max(
      scrollX + margin,
      Math.min(left, scrollX + viewportWidth - QUICK_CARD_WIDTH - margin),
    );

    top = Math.max(
      scrollY + margin,
      Math.min(top, scrollY + viewportHeight - QUICK_ESTIMATED_HEIGHT - margin),
    );

    return { top, left };
  };

  useEffect(() => {
    if (!isOpen || variant !== 'quick') {
      setQuickPosition(null);
      return;
    }
    setQuickPosition(computeBaseQuickPosition());
  }, [isOpen, variant, anchorPosition]);

  useEffect(() => {
    if (!isOpen || variant !== 'quick' || !quickCardRef.current || !quickPosition) {
      return;
    }

    if (typeof window === 'undefined') return;

    const margin = 12;
    const rect = quickCardRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newLeft = quickPosition.left;
    let newTop = quickPosition.top;

    if (rect.left < margin) {
      newLeft += margin - rect.left;
    }
    if (rect.right > viewportWidth - margin) {
      newLeft -= rect.right - (viewportWidth - margin);
    }
    if (rect.top < margin) {
      newTop += margin - rect.top;
    }
    if (rect.bottom > viewportHeight - margin) {
      newTop -= rect.bottom - (viewportHeight - margin);
    }

    const maxLeft = scrollX + viewportWidth - rect.width - margin;
    const minLeft = scrollX + margin;
    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));

    const maxTop = scrollY + viewportHeight - rect.height - margin;
    const minTop = scrollY + margin;
    newTop = Math.max(minTop, Math.min(newTop, maxTop));

    if (Math.abs(newLeft - quickPosition.left) > 0.5 || Math.abs(newTop - quickPosition.top) > 0.5) {
      setQuickPosition({ top: newTop, left: newLeft });
    }
  }, [isOpen, variant, quickPosition]);

  if (!isOpen) {
    return null;
  }

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
  ];

  const panelSurface = isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-gray-900';
  const panelBorder = isDark ? 'border border-neutral-700' : 'border border-gray-200';
  const dividerClass = isDark ? 'border-neutral-800' : 'border-gray-200';
  const iconColor = isDark ? 'text-neutral-400' : 'text-gray-600';
  const subtleText = isDark ? 'text-neutral-400' : 'text-gray-600';
  const inputBase =
    'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const inputTheme = isDark
    ? 'bg-neutral-900 border-neutral-700 text-neutral-100 placeholder-neutral-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  const sectionHeading = isDark ? 'text-neutral-200' : 'text-gray-800';
  const reminderBadge = isDark ? 'bg-neutral-800 text-neutral-200' : 'bg-blue-50 text-gray-700';
  const reminderRemove = isDark ? 'text-neutral-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600';

  const headerPadding = variant === 'full' ? 'px-10 pt-8 pb-4' : 'px-6 pt-6 pb-4';
  const bodyPadding = variant === 'full' ? 'px-10 pb-6' : 'px-6 pb-4';
  const footerPadding = variant === 'full' ? 'px-10 py-5' : 'px-6 py-4';

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="h-1.5 rounded-t-3xl" style={{ backgroundColor: formData.color }} />

      <div className={headerPadding}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={`text-2xl font-semibold ${sectionHeading}`}>
            {editEvent ? 'Edit event' : 'Add event'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-gray-100 text-gray-500'}`}
            aria-label="Close event form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={bodyPadding}>
        <div className={`space-y-5 ${variant === 'full' ? 'max-w-full' : ''}`}>
          <div>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className={`text-2xl font-medium border-0 border-b-2 pb-2 focus:border-blue-500 focus:outline-none w-full ${
                isDark ? 'bg-transparent border-neutral-700 text-neutral-100' : 'bg-transparent border-gray-200 text-gray-900'
              }`}
              placeholder="Add title"
            />
          </div>

          <div className="flex items-start gap-4">
            <Clock className={`w-5 h-5 mt-3 ${iconColor}`} />
            <div className="flex-1 space-y-3">
              <div className={`grid gap-3 ${variant === 'full' ? 'md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                <input
                  type="datetime-local"
                  name="start"
                  required
                  value={formData.start}
                  onChange={handleChange}
                  className={`${inputBase} ${inputTheme}`}
                />
                <input
                  type="datetime-local"
                  name="end"
                  required
                  value={formData.end}
                  onChange={handleChange}
                  className={`${inputBase} ${inputTheme}`}
                />
              </div>
              <label className="flex items-center text-sm gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className={subtleText}>All day</span>
              </label>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className={`w-5 h-5 mt-2 ${iconColor}`} />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`${inputBase} ${inputTheme}`}
              placeholder="Add location"
            />
          </div>

          <div className="flex items-start gap-4">
            <AlignLeft className={`w-5 h-5 mt-2 ${iconColor}`} />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={variant === 'full' ? 6 : 4}
              className={`${inputBase} ${inputTheme} resize-none`}
              placeholder="Add description"
            />
          </div>

          <div className="flex items-start gap-4">
            <div className="w-5 h-5 mt-2 rounded-full" style={{ backgroundColor: formData.color }} />
            <div className="flex-1">
              <p className={`text-sm mb-2 ${subtleText}`}>Event colour</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => {
                  const isSelected = formData.color === color.value;
                  const ringClass = isSelected
                    ? isDark
                      ? 'ring-2 ring-offset-2 ring-offset-neutral-900 ring-white/70'
                      : 'ring-2 ring-offset-2 ring-offset-white ring-blue-400'
                    : '';
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${ringClass}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Bell className={`w-5 h-5 mt-2 ${iconColor}`} />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={reminderMinutes}
                  onChange={(event) => setReminderMinutes(event.target.value)}
                  className={`w-24 ${inputBase} ${inputTheme}`}
                  min="1"
                />
                <span className={`text-sm ${subtleText}`}>minutes before</span>
                <button
                  type="button"
                  onClick={handleAddReminder}
                  className="px-3 py-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.reminders.length > 0 && (
                <div className="space-y-2">
                  {formData.reminders.map((reminder, index) => (
                    <div
                      key={`${reminder.minutesBefore}-${index}`}
                      className={`flex items-center justify-between rounded-md px-3 py-2 ${reminderBadge}`}
                    >
                      <span className="text-sm">
                        {reminder.minutesBefore} minutes before
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReminder(index)}
                        className={reminderRemove}
                        aria-label="Remove reminder"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t ${dividerClass} ${footerPadding}`}
      >
        <div className="flex items-center gap-3">
          {editEvent && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isDark ? 'text-red-400 hover:bg-red-500/10 disabled:text-red-900/60' : 'text-red-600 hover:bg-red-50 disabled:text-red-300'
              } disabled:cursor-not-allowed`}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
          {variant === 'quick' && onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              More options
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClose}
            className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
              isDark ? 'text-neutral-300 hover:bg-neutral-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-black/40'}`}
        onClick={handleClose}
      />

      {variant === 'full' ? (
        <div className="relative z-10 flex min-h-full items-start justify-center overflow-y-auto py-8 px-4">
          <div
            className={`w-full max-w-5xl rounded-3xl ${panelSurface} ${panelBorder} max-h-[92vh] overflow-y-auto`}
            onClick={(event) => event.stopPropagation()}
          >
            {renderForm()}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            ref={quickCardRef}
            className={`pointer-events-auto rounded-3xl ${panelSurface} ${panelBorder} max-h-[85vh] overflow-y-auto`}
            style={
              quickPosition
                ? {
                    position: 'absolute',
                    top: quickPosition.top,
                    left: quickPosition.left,
                    width: QUICK_CARD_WIDTH,
                    maxWidth: '95vw',
                  }
                : {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: QUICK_CARD_WIDTH,
                    maxWidth: '95vw',
                  }
            }
            onClick={(event) => event.stopPropagation()}
          >
            {renderForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;
