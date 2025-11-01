import { Response } from 'express';
import Event from '../models/Event';
import { expandAllEvents } from '../utils/recurrence';
import {
  CreateEventSchema,
  UpdateEventSchema,
  QueryParamsSchema,
} from '../validators/eventValidator';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = QueryParamsSchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: validation.error.errors,
      });
      return;
    }

    const { start, end } = validation.data;
    const rangeStart = new Date(start);
    const rangeEnd = new Date(end);

    const events = await Event.find({
      userId: req.user?._id,
      $or: [
        {
          recurrence: { $exists: false },
          start: { $lte: rangeEnd },
          end: { $gte: rangeStart },
        },
        {
          recurrence: { $exists: true },
          $or: [
            { 'recurrence.until': { $exists: false } },
            { 'recurrence.until': { $gte: rangeStart } },
          ],
        },
      ],
    });

    const expandedEvents = expandAllEvents(events, rangeStart, rangeEnd);

    res.status(200).json({
      success: true,
      count: expandedEvents.length,
      data: expandedEvents,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      error: 'Failed to fetch events',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = CreateEventSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid event data',
        details: validation.error.errors,
      });
      return;
    }

    const eventData = validation.data;

    const newEvent = new Event({
      ...eventData,
      userId: req.user?._id,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
      recurrence: eventData.recurrence
        ? {
            ...eventData.recurrence,
            dtstart: new Date(eventData.recurrence.dtstart),
            until: eventData.recurrence.until
              ? new Date(eventData.recurrence.until)
              : undefined,
            exdates: eventData.recurrence.exdates?.map((d) => new Date(d)),
          }
        : undefined,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      error: 'Failed to create event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, userId: req.user?._id });

    if (!event) {
      res.status(404).json({
        error: 'Event not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      error: 'Failed to fetch event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const validation = UpdateEventSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid event data',
        details: validation.error.errors,
      });
      return;
    }

    const updateData = validation.data;

    const processedUpdate: any = { ...updateData };
    if (updateData.start) {
      processedUpdate.start = new Date(updateData.start);
    }
    if (updateData.end) {
      processedUpdate.end = new Date(updateData.end);
    }
    if (updateData.recurrence) {
      processedUpdate.recurrence = {
        ...updateData.recurrence,
        dtstart: new Date(updateData.recurrence.dtstart),
        until: updateData.recurrence.until
          ? new Date(updateData.recurrence.until)
          : undefined,
        exdates: updateData.recurrence.exdates?.map((d) => new Date(d)),
      };
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, userId: req.user?._id },
      processedUpdate,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      res.status(404).json({
        error: 'Event not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      error: 'Failed to update event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: req.user?._id });

    if (!deletedEvent) {
      res.status(404).json({
        error: 'Event not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      error: 'Failed to delete event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
