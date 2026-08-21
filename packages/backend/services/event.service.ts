import type { Event, EventRegistration } from "@aurix/types";
import { eventModel } from "../models/event.model";
import { profileModel } from "../models/profile.model";
import { emailService } from "./email.service";
import { AuthError } from "./auth.service";
import type { CreateEventInput, UpdateEventInput, UpdateRegistrationInput } from "../validators/event.validator";

export class EventNotFoundError extends AuthError {
  constructor(id: string) {
    super(`Event '${id}' not found`, "EVENT_NOT_FOUND", 404);
  }
}

export class EventNotPublishedError extends AuthError {
  constructor() {
    super("This event is not available", "EVENT_NOT_AVAILABLE", 404);
  }
}

export class RegistrationNotFoundError extends AuthError {
  constructor(id: string) {
    super(`Registration '${id}' not found`, "REGISTRATION_NOT_FOUND", 404);
  }
}

export class AlreadyRegisteredError extends AuthError {
  constructor() {
    super("You are already registered for this event", "ALREADY_REGISTERED", 409);
  }
}

export class RegistrationClosedError extends AuthError {
  constructor() {
    super("Registration for this event is closed or full", "REGISTRATION_CLOSED", 409);
  }
}

class EventService {
  /**
   * List events.
   * Members: published only.
   * Super Admin: all events including drafts.
   */
  async list(options: { forAdmin?: boolean; department_id?: string } = {}): Promise<Event[]> {
    const records = await eventModel.listEvents({
      forAdmin: options.forAdmin,
      department_id: options.department_id,
    });
    return records.map((r) => eventModel.eventToDTO(r));
  }

  /**
   * Get a single event by ID.
   * Members: only published events.
   * Super Admin: any event.
   */
  async getById(id: string, forAdmin = false): Promise<Event> {
    const record = await eventModel.findEventById(id);
    if (!record) throw new EventNotFoundError(id);
    if (!forAdmin && record.status !== "published") throw new EventNotPublishedError();
    return eventModel.eventToDTO(record);
  }

  /**
   * Create a new event (Super Admin only). Status starts as draft.
   */
  async create(input: CreateEventInput, createdBy: string): Promise<Event> {
    const created = await eventModel.createEvent({ ...input, created_by: createdBy });
    return eventModel.eventToDTO(created);
  }

  /**
   * Update an event (Super Admin only).
   */
  async update(id: string, input: UpdateEventInput): Promise<Event> {
    const existing = await eventModel.findEventById(id);
    if (!existing) throw new EventNotFoundError(id);

    const updated = await eventModel.updateEvent(id, {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.short_description !== undefined && { short_description: input.short_description }),
      ...(input.cover_image_url !== undefined && { cover_image_url: input.cover_image_url }),
      ...(input.mode !== undefined && { mode: input.mode }),
      ...(input.venue !== undefined && { venue: input.venue }),
      ...(input.meeting_link !== undefined && { meeting_link: input.meeting_link }),
      ...(input.department_id !== undefined && { department_id: input.department_id }),
      ...(input.starts_at !== undefined && { starts_at: input.starts_at }),
      ...(input.ends_at !== undefined && { ends_at: input.ends_at }),
      ...(input.registration_deadline !== undefined && { registration_deadline: input.registration_deadline }),
      ...(input.max_participants !== undefined && { max_participants: input.max_participants }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.tags !== undefined && { tags: input.tags }),
    });

    if (!updated) throw new EventNotFoundError(id);
    return eventModel.eventToDTO(updated);
  }

  /**
   * Delete an event (Super Admin only). Also removes all registrations.
   */
  async delete(id: string): Promise<void> {
    const existing = await eventModel.findEventById(id);
    if (!existing) throw new EventNotFoundError(id);
    await eventModel.deleteEvent(id);
  }

  /**
   * Register a member for an event.
   * Validates: event published, deadline not passed, capacity not exceeded, not already registered.
   */
  async register(eventId: string, userId: string): Promise<EventRegistration> {
    const ev = await eventModel.findEventById(eventId);
    if (!ev || ev.status !== "published") throw new EventNotPublishedError();

    // Check registration deadline
    if (ev.registration_deadline && new Date() > new Date(ev.registration_deadline)) {
      throw new RegistrationClosedError();
    }

    // Check capacity
    if (ev.max_participants !== null && ev.registration_count >= ev.max_participants) {
      throw new RegistrationClosedError();
    }

    // Check already registered
    const existing = await eventModel.findRegistration(eventId, userId);
    if (existing && existing.status !== "cancelled") throw new AlreadyRegisteredError();

    // Fetch user profile to populate registration
    const user = await profileModel.findById(userId);
    if (!user) throw new AuthError("User not found", "USER_NOT_FOUND", 404);

    const reg = await eventModel.createRegistration({
      event_id: eventId,
      user_id: userId,
      full_name: user.full_name,
      email: user.email,
      branch: user.branch ?? "Not specified",
      year: user.year ?? 1,
      phone: user.phone ?? null,
    });

    const registration = eventModel.registrationToDTO(reg);
    const event = eventModel.eventToDTO(ev);
    void emailService.sendEventRegistrationConfirmation(registration, event).catch((error: unknown) => {
      console.error("[Event] Registration confirmation email failed:", error);
    });
    return registration;
  }

  /**
   * Get all registrations for a specific event. Super Admin only.
   */
  async getRegistrations(eventId: string): Promise<EventRegistration[]> {
    const ev = await eventModel.findEventById(eventId);
    if (!ev) throw new EventNotFoundError(eventId);

    const regs = await eventModel.listRegistrationsForEvent(eventId);
    return regs.map((r) => eventModel.registrationToDTO(r));
  }

  /**
   * Get all events a user has registered for (own registrations).
   */
  async getMyRegistrations(userId: string): Promise<{
    registration: EventRegistration;
    event: Event;
  }[]> {
    const regs = await eventModel.listRegistrationsByUser(userId);
    const results: { registration: EventRegistration; event: Event }[] = [];

    for (const reg of regs) {
      const ev = await eventModel.findEventById(reg.event_id);
      if (ev) {
        results.push({
          registration: eventModel.registrationToDTO(reg),
          event: eventModel.eventToDTO(ev),
        });
      }
    }

    return results;
  }

  /**
   * Update a registration status (mark attended / cancel). Super Admin only.
   */
  async updateRegistration(
    eventId: string,
    regId: string,
    input: UpdateRegistrationInput
  ): Promise<EventRegistration> {
    const ev = await eventModel.findEventById(eventId);
    if (!ev) throw new EventNotFoundError(eventId);

    const reg = await eventModel.findRegistrationById(regId);
    if (!reg || reg.event_id !== eventId) throw new RegistrationNotFoundError(regId);

    const updated = await eventModel.updateRegistration(regId, { status: input.status });
    if (!updated) throw new RegistrationNotFoundError(regId);

    return eventModel.registrationToDTO(updated);
  }
}

export const eventService = new EventService();
