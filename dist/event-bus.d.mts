import { Observable } from 'rxjs';
import { IEventBus, IEventDispatcher, IEventData, IEvent, IListener } from '@pixielity/ts-types';

/**
 * Event bus for reactive event handling using RxJS
 */
declare class EventBus implements IEventBus {
    /**
     * Subject for all events
     */
    private eventSubject;
    /**
     * The event dispatcher instance
     */
    private readonly dispatcher;
    /**
     * Creates a new EventBus instance
     *
     * @param dispatcher - The event dispatcher
     */
    constructor(dispatcher: IEventDispatcher);
    /**
     * Get an observable of all events
     *
     * @returns An observable of all events
     */
    events(): Observable<IEventData>;
    /**
     * Get an observable of events with a specific name
     *
     * @param eventName - The event name
     * @returns An observable of events with the specified name
     */
    ofType(eventName: string): Observable<IEventData>;
    /**
     * Get an observable of events of a specific class
     *
     * @param eventClass - The event class
     * @returns An observable of events of the specified class
     */
    ofClass<T extends IEvent>(eventClass: new (...args: any[]) => T): Observable<IEventData<T>>;
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
     * Subscribe to an event with a listener
     *
     * @param event - The event name or class
     * @param listener - The listener function or object
     * @returns A function to unsubscribe
     */
    subscribe(event: string | (new (...args: any[]) => IEvent), listener: IListener | Function): () => void;
    /**
     * Subscribe to an event with a typed listener
     *
     * @param eventClass - The event class
     * @param listener - The listener function
     * @returns A function to unsubscribe
     */
    subscribeToEvent<T extends IEvent>(eventClass: new (...args: any[]) => T, listener: (event: T) => void): () => void;
    /**
     * Dispatch an event through the event bus
     *
     * @param event - The event to dispatch
     * @param payload - Optional payload if event is a string
     * @returns A promise that resolves when the event has been dispatched
     */
    dispatch(event: string | IEvent, payload?: any): Promise<any[]>;
}

export { EventBus };
