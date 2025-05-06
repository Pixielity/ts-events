import { IEventDispatcher, IQueueManager, IListener, ISubscriber, IEvent } from '@pixielity/ts-types';
import { Observable } from 'rxjs';

/**
 * Event data structure for the event stream
 */
interface EventData<T = any> {
    /**
     * The name of the event
     */
    name: string;
    /**
     * The event payload
     */
    payload: T;
    /**
     * The timestamp when the event was dispatched
     */
    timestamp: number;
}
/**
 * Symbol for the queue manager dependency injection token
 */
declare const QUEUE_MANAGER_TOKEN: unique symbol;
/**
 * The main event dispatcher implementation.
 * Responsible for registering listeners and dispatching events.
 * Also provides reactive event handling capabilities.
 */
declare class EventDispatcher implements IEventDispatcher {
    /**
     * Map of event names to listeners.
     */
    private listeners;
    /**
     * Subject for broadcasting events
     */
    private eventSubject;
    /**
     * Subject for broadcasting events with name and payload
     */
    private eventStreamSubject;
    /**
     * Queue manager instance.
     */
    private queueManager?;
    /**
     * Creates a new EventDispatcher instance.
     *
     * @param {QueueManager} [queueManager] - Optional queue manager for queueable events
     */
    constructor(queueManager?: IQueueManager);
    /**
     * [listenerCount description]
     *
     * @param   {string}  eventName  [eventName description]
     *
     * @return  {number}             [return description]
     */
    listenerCount(eventName: string): number;
    /**
     * Register an event listener with the dispatcher.
     *
     * @param {string} event - The event name
     * @param {Listener | Function} listener - The listener function or object
     * @returns {() => void} A function to remove the listener
     */
    listen(event: string, listener: IListener | Function): () => void;
    /**
     * Determine if a given event has listeners.
     *
     * @param {string} eventName - The event name
     * @returns {boolean} True if the event has listeners
     */
    hasListeners(eventName: string): boolean;
    /**
     * Register an event subscriber with the dispatcher.
     *
     * @param {Subscriber} subscriber - The subscriber to register
     */
    subscribe(subscriber: ISubscriber): void;
    /**
     * Dispatch an event and call the listeners.
     *
     * @param {string | Event} event - The event name or object
     * @param {any} [payload] - The event payload (if event is a string)
     * @returns {Promise<any[]>} Array of results from the listeners
     */
    dispatch(event: string | IEvent, payload?: any): Promise<any[]>;
    /**
     * Dispatch an event and halt when the first listener returns a non-null response.
     *
     * @param {string | Event} event - The event name or object
     * @param {any} [payload] - The event payload (if event is a string)
     * @returns {Promise<any>} The first non-null response or null
     */
    until(event: string | IEvent, payload?: any): Promise<any>;
    /**
     * Remove a set of listeners from the dispatcher.
     *
     * @param {string} event - The event name
     */
    forget(event: string): void;
    /**
     * Remove all listeners from the dispatcher.
     */
    forgetAll(): void;
    /**
     * Get an observable of all events
     *
     * @returns An observable of all events
     */
    events(): Observable<EventData>;
    /**
     * Get an observable of all events with their names
     *
     * @returns An observable of events with their names
     */
    getEventStream(): Observable<{
        name: string;
        event: any;
    }>;
    /**
     * Get an observable of events with a specific name
     *
     * @param eventName - The event name
     * @returns An observable of events with the specified name
     */
    ofType(eventName: string): Observable<EventData>;
    /**
     * Get an observable of events of a specific class
     *
     * @param eventClass - The event class
     * @returns An observable of events of the specified class
     */
    ofClass<T extends IEvent>(eventClass: new (...args: any[]) => T): Observable<EventData<T>>;
    /**
     * Get an observable of event payloads with a specific name
     *
     * @param eventName - The event name
     * @returns An observable of event payloads with the specified name
     */
    on<T = any>(eventName: string): Observable<T>;
    /**
     * Get an observable of event payloads of a specific class
     *
     * @param eventClass - The event class
     * @returns An observable of event payloads of the specified class
     */
    onEvent<T extends IEvent>(eventClass: new (...args: any[]) => T): Observable<T>;
    /**
     * Check if an object is queueable.
     *
     * @param obj - The object to check
     * @returns True if the object is queueable
     * @private
     */
    private isQueueable;
    /**
     * Queue an event for later processing.
     *
     * @param event - The queueable event
     * @returns Promise resolving when the event is queued
     * @private
     */
    private queueEvent;
    /**
     * Queue a listener for later processing.
     *
     * @param listener - The queueable listener
     * @param event - The event to handle
     * @returns Promise resolving when the listener is queued
     * @private
     */
    private queueListener;
}

export { type EventData, EventDispatcher, QUEUE_MANAGER_TOKEN };
