import { injectable, inject } from 'inversify'
import { Subject, type Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { IEvent, IEventDispatcher, IEventBus, IEventData, IListener } from '@pixielity/ts-types'

import { getEventName } from './utils/reflection.util'

/**
 * Event bus for reactive event handling using RxJS
 */
@injectable()
export class EventBus implements IEventBus {
  /**
   * Subject for all events
   */
  private eventSubject = new Subject<IEventData>()

  /**
   * The event dispatcher instance
   */
  private readonly dispatcher: IEventDispatcher

  /**
   * Creates a new EventBus instance
   *
   * @param dispatcher - The event dispatcher
   */
  constructor(
    @inject(IEventDispatcher.$)
    dispatcher: IEventDispatcher,
  ) {
    this.dispatcher = dispatcher
    // Subscribe to all events from the dispatcher
    this.dispatcher.getEventStream().subscribe(({ name, event }: { name: string; event: any }) => {
      this.eventSubject.next({
        name,
        payload: event,
        timestamp: Date.now(),
      })
    })
  }

  /**
   * Get an observable of all events
   *
   * @returns An observable of all events
   */
  public events(): Observable<IEventData> {
    return this.eventSubject.asObservable()
  }

  /**
   * Get an observable of events with a specific name
   *
   * @param eventName - The event name
   * @returns An observable of events with the specified name
   */
  public ofType(eventName: string): Observable<IEventData> {
    return this.eventSubject.pipe(filter((event) => event.name === eventName))
  }

  /**
   * Get an observable of events of a specific class
   *
   * @param eventClass - The event class
   * @returns An observable of events of the specified class
   */
  public ofClass<T extends IEvent>(
    eventClass: new (...args: any[]) => T,
  ): Observable<IEventData<T>> {
    const eventName = getEventName(eventClass)
    return this.ofType(eventName) as Observable<IEventData<T>>
  }

  /**
   * Get an observable of event payloads with a specific name
   *
   * @param eventName - The event name
   * @returns An observable of event payloads with the specified name
   */
  public on<T = any>(eventName: string): Observable<T> {
    return this.ofType(eventName).pipe(map((event) => event.payload as T))
  }

  /**
   * Get an observable of event payloads of a specific class
   *
   * @param eventClass - The event class
   * @returns An observable of event payloads of the specified class
   */
  public onEvent<T extends IEvent>(eventClass: new (...args: any[]) => T): Observable<T> {
    return this.ofClass(eventClass).pipe(map((event) => event.payload as T))
  }

  /**
   * Subscribe to an event with a listener
   *
   * @param event - The event name or class
   * @param listener - The listener function or object
   * @returns A function to unsubscribe
   */
  public subscribe(
    event: string | (new (...args: any[]) => IEvent),
    listener: IListener | Function,
  ): () => void {
    const eventName = typeof event === 'string' ? event : getEventName(event)
    return this.dispatcher.listen(eventName, listener)
  }

  /**
   * Subscribe to an event with a typed listener
   *
   * @param eventClass - The event class
   * @param listener - The listener function
   * @returns A function to unsubscribe
   */
  public subscribeToEvent<T extends IEvent>(
    eventClass: new (...args: any[]) => T,
    listener: (event: T) => void,
  ): () => void {
    return this.dispatcher.listen(getEventName(eventClass), listener)
  }

  /**
   * Dispatch an event through the event bus
   *
   * @param event - The event to dispatch
   * @param payload - Optional payload if event is a string
   * @returns A promise that resolves when the event has been dispatched
   */
  public async dispatch(event: string | IEvent, payload?: any): Promise<any[]> {
    return this.dispatcher.dispatch(event, payload)
  }
}
