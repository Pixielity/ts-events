import "reflect-metadata"
import { injectable } from "inversify"
import { LISTENERS_METADATA_KEY } from "../constants/metadata.constants"
import type { Event } from "../interfaces/event.interface"

/**
 * Options for the Listener decorator.
 */
export interface ListenerOptions {
  /**
   * The event(s) to listen for. Can be a string event name or an Event class.
   */
  event: string | (new (...args: any[]) => Event) | (string | (new (...args: any[]) => Event))[]

  /**
   * Whether the listener should be queued.
   */
  queued?: boolean

  /**
   * The delay in seconds before processing the listener (if queued).
   */
  delay?: number

  /**
   * The queue connection to use (if queued).
   */
  connection?: string

  /**
   * The queue to use (if queued).
   */
  queue?: string
}

/**
 * Decorator that marks a class as an event listener.
 *
 * @param {ListenerOptions} options - Options for the listener
 * @returns {ClassDecorator} The decorator function
 *
 * @example
 * ```typescript
 * @Listener({ event: UserCreated })
 * class SendWelcomeEmail implements Listener<UserCreated> {
 *   handle(event: UserCreated): void {
 *     // Send welcome email logic
 *   }
 * }
 *
 * // With multiple events
 * @Listener({ event: [UserCreated, UserActivated], queued: true, delay: 60 })
 * class NotifyAdminOfUserActivity implements Listener {
 *   handle(event: Event): void {
 *     // Notify admin logic
 *   }
 * }
 * ```
 */
export function Listener(options: ListenerOptions): ClassDecorator {
  return (target: Function) => {
    // Apply injectable decorator
    injectable()(target)

    const events = Array.isArray(options.event) ? options.event : [options.event]

    // Store listener metadata
    Reflect.defineMetadata(
      LISTENERS_METADATA_KEY,
      {
        events,
        queued: options.queued || false,
        delay: options.delay || 0,
        connection: options.connection || null,
        queue: options.queue || null,
        target,
      },
      target,
    )

    // If queued, implement ShouldQueue interface methods
    if (options.queued) {
      if (!target.prototype.shouldQueue) {
        target.prototype.shouldQueue = () => true
      }

      if (!target.prototype.connection) {
        target.prototype.connection = () => options.connection || null
      }

      if (!target.prototype.queue) {
        target.prototype.queue = () => options.queue || null
      }

      if (!target.prototype.delay) {
        target.prototype.delay = () => options.delay || 0
      }
    }

    return target
  }
}
