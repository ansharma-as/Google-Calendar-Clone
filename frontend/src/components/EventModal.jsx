import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { X, Clock, MapPin, AlignLeft, Bell, Trash2, Save, Palette } from 'lucide-react';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  clearSelectedEvent,
} from '../store/slices/eventsSlice';
import { useTheme } from '../context/ThemeContext';

const QUICK_CARD_WIDTH = 480;

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  editEvent,
  variant = 'quick',
  onExpand,
}) => {
  const dispatch = useDispatch();
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
  const [isSaving, setIsSaving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

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

    if (isSaving) return;

    setIsSaving(true);
    try {
      const eventPayload = {
        ...formData,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
      };

      if (editEvent) {
        await dispatch(updateEvent({ id: editEvent._id, data: eventPayload })).unwrap();
      } else {
        await dispatch(createEvent(eventPayload)).unwrap();
      }

      handleClose();
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editEvent || !window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(deleteEvent(editEvent._id)).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;

    setIsAnimating(false);
    setTimeout(() => {
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
      setIsSaving(false);
      dispatch(clearSelectedEvent());
      onClose();
    }, 200);
  };


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
    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
  const inputTheme = isDark
    ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500 hover:border-neutral-600'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400';
  const sectionHeading = isDark ? 'text-neutral-200' : 'text-gray-800';
  const reminderRemove = isDark ? 'text-neutral-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600';

  const headerPadding = variant === 'full' ? 'px-8 pt-5 pb-4' : 'px-6 pt-4 pb-4';
  const bodyPadding = variant === 'full' ? 'px-8 pb-6' : 'px-6 pb-5';
  const footerPadding = variant === 'full' ? 'px-8 py-5' : 'px-6 py-4';

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="h-1.5 rounded-t-3xl shrink-0" style={{ backgroundColor: formData.color }} />

      <div className={`${headerPadding} shrink-0`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={`text-xl font-semibold ${sectionHeading}`}>
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

      <div className={`${bodyPadding} overflow-y-auto min-h-0`}>
        <div className={`space-y-6 ${variant === 'full' ? 'max-w-full' : ''}`}>
          <div>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className={`text-lg font-semibold border-0 border-b-2 pb-3 focus:border-blue-500 focus:outline-none w-full transition-colors duration-200 ${
                isDark ? 'bg-transparent border-neutral-700 text-neutral-100 placeholder-neutral-500' : 'bg-transparent border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Add title"
            />
          </div>

          <div className="flex items-start gap-4">
            <Clock className={`w-5 h-5 mt-3 ${iconColor}`} />
            <div className="flex-1 space-y-2">
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
            <div className="w-5 h-5 mt-2 rounded-full shadow-sm" style={{ backgroundColor: formData.color }} />
            <div className="flex-1">
              <p className={`text-sm mb-3 font-medium ${subtleText}`}>Event color</p>
              <div className="flex flex-wrap gap-4">
                {colorOptions.map((color) => {
                  const isSelected = formData.color === color.value;
                  const ringClass = isSelected
                    ? isDark
                      ? 'ring-2 ring-offset-2 ring-offset-neutral-900 ring-white/70 scale-110'
                      : 'ring-2 ring-offset-2 ring-offset-white ring-blue-400 scale-110'
                    : '';
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg ${ringClass}`}
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
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  value={reminderMinutes}
                  onChange={(event) => setReminderMinutes(event.target.value)}
                  className={`w-28 ${inputBase} ${inputTheme}`}
                  min="1"
                />
                <span className={`text-sm font-medium ${subtleText}`}>minutes before</span>
                <button
                  type="button"
                  onClick={handleAddReminder}
                  className="px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                >
                  Add
                </button>
              </div>

              {formData.reminders.length > 0 && (
                <div className="space-y-2">
                  {formData.reminders.map((reminder, index) => (
                    <div
                      key={`${reminder.minutesBefore}-${index}`}
                      className={`flex items-center justify-between rounded-lg px-4 py-2.5 border transition-all duration-200 ${
                        isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-blue-50 border-blue-100'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {reminder.minutesBefore} minutes before
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReminder(index)}
                        className={`p-1 rounded-md transition-colors duration-200 ${reminderRemove}`}
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
        className={`flex flex-wrap items-center justify-between border-t ${dividerClass} ${footerPadding} shrink-0`}
      >
        <div className="flex items-center">
          {editEvent && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                isDark ? 'text-red-400 hover:bg-red-500/10 disabled:text-red-900/60 disabled:opacity-50' : 'text-red-600 hover:bg-red-50 disabled:text-red-300 disabled:opacity-50'
              } disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          )}
          {variant === 'quick' && onExpand && !isSaving && (
            <button
              type="button"
              onClick={onExpand}
              className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              More options
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isDark ? 'text-neutral-300 hover:bg-neutral-800 disabled:opacity-50' : 'text-gray-700 hover:bg-gray-100 disabled:opacity-50'
            } disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        className={`absolute inset-0 transition-all duration-200 ${isDark ? 'bg-black/70' : 'bg-black/40'}`}
        onClick={handleClose}
      />

      {variant === 'full' ? (
        <div className="relative z-10 flex min-h-full items-start justify-center overflow-y-auto py-8 px-4">
          <div
            className={`w-full max-w-3xl rounded-2xl ${panelSurface} shadow-2xl border ${
              isDark ? 'border-neutral-700' : 'border-gray-200'
            } max-h-[90vh] flex flex-col transform transition-all duration-300 ${
              isAnimating ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {renderForm()}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex min-h-full items-center justify-center overflow-y-auto py-8 px-4">
          <div
            className={`w-full rounded-2xl ${panelSurface} shadow-2xl border ${
              isDark ? 'border-neutral-700' : 'border-gray-200'
            } max-h-[85vh] flex flex-col transform transition-all duration-200 overflow-auto ${
              isAnimating ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'
            }`}
            style={{
              maxWidth: `${QUICK_CARD_WIDTH}px`,
            }}
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
