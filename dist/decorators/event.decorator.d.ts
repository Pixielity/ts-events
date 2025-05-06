/**
 * Options for the Event decorator.
 */
interface EventOptions {
    /**
     * The name of the event. If not provided, the class name will be used.
     */
    name?: string;
    /**
     * Whether the event should be broadcast.
     */
    broadcast?: boolean;
    /**
     * The channels to broadcast on.
     */
    channels?: string[];
}
/**
 * Decorator that marks a class as an event.
 *
 * @param {EventOptions} [options] - Options for the event
 * @returns {ClassDecorator} The decorator function
 *
 * @example
 * \`\`\`typescript
 * @Event()
 * class UserCreated implements IEvent {
 *   constructor(public readonly userId: string) {}
 * }
 *
 * // With options
 * @Event({ name: 'user.created', broadcast: true, channels: ['users'] })
 * class UserCreated implements IEvent {
 *   constructor(public readonly userId: string) {}
 * }
 * \`\`\`
 */
declare function Event(options?: EventOptions): ClassDecorator;

export { Event, type EventOptions };
