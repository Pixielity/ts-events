import { IEvent } from '@pixielity/ts-types';

/**
 * Options for the Listener decorator.
 */
interface ListenerOptions {
    /**
     * The event(s) to listen for. Can be a string event name or an IEvent class.
     */
    event: string | (new (...args: any[]) => IEvent) | (string | (new (...args: any[]) => IEvent))[];
    /**
     * Whether the listener should be queued.
     */
    queued?: boolean;
    /**
     * The delay in seconds before processing the listener (if queued).
     */
    delay?: number;
    /**
     * The queue connection to use (if queued).
     */
    connection?: string;
    /**
     * The queue to use (if queued).
     */
    queue?: string;
}
/**
 * Decorator that marks a class as an event listener.
 *
 * @param {ListenerOptions} options - Options for the listener
 * @returns {ClassDecorator} The decorator function
 *
 * @example
 * \`\`\`typescript
 * @Listener({ event: UserCreated })
 * class SendWelcomeEmail implements IListener<UserCreated> {
 *   handle(event: UserCreated): void {
 *     // Send welcome email logic
 *   }
 * }
 *
 * // With multiple events
 * @Listener({ event: [UserCreated, UserActivated], queued: true, delay: 60 })
 * class NotifyAdminOfUserActivity implements IListener {
 *   handle(event: IEvent): void {
 *     // Notify admin logic
 *   }
 * }
 * \`\`\`
 */
declare function Listener(options: ListenerOptions): ClassDecorator;

export { Listener, type ListenerOptions };
