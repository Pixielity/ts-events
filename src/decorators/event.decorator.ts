import "reflect-metadata"
import { EVENTS_METADATA_KEY } from "../constants/metadata.constants"

/**
 * Options for the Event decorator.
 */
export interface EventOptions {
  /**
   * The name of the event. If not provided, the class name will be used.
   */
  name?: string

  /**
   * Whether the event should be broadcast.
   */
  broadcast?: boolean

  /**
   * The channels to broadcast on.
   */
  channels?: string[]
}

/**
 * Decorator that marks a class as an event.
 *
 * @param {EventOptions} [options] - Options for the event
 * @returns {ClassDecorator} The decorator function
 *
 * @example
 * ```typescript
 * @Event()
 * class UserCreated implements Event {
 *   constructor(public readonly userId: string) {}
 * }
 *
 * // With options
 * @Event({ name: 'user.created', broadcast: true, channels: ['users'] })
 * class UserCreated implements Event {
 *   constructor(public readonly userId: string) {}
 * }
 * ```
 */
export function Event(options: EventOptions = {}): ClassDecorator {
  return (target: Function) => {
    // Store event metadata
    Reflect.defineMetadata(
      EVENTS_METADATA_KEY,
      {
        name: options.name || target.name,
        broadcast: options.broadcast || false,
        channels: options.channels || [],
        target,
      },
      target,
    )

    // Add default implementations if not provided
    if (!target.prototype.getEventName) {
      target.prototype.getEventName = () => options.name || target.name
    }

    if (!target.prototype.shouldBroadcast && options.broadcast !== undefined) {
      target.prototype.shouldBroadcast = () => options.broadcast
    }

    if (!target.prototype.broadcastOn && options.channels) {
      target.prototype.broadcastOn = () => options.channels
    }

    return target
  }
}
