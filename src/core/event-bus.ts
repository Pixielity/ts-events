import { injectable, inject } from "inversify"
import { Subject, type Observable, filter, map } from "rxjs"
import type { Event } from "../interfaces/event.interface"
import type { EventDispatcher } from "../interfaces/dispatcher.interface"
import type { IEventBus, EventData } from "../interfaces/event-bus.interface"
import { getEventName } from "../utils/reflection.utils"

/**
 * Event bus for reactive event handling using RxJS
 */
@injectable()
export class EventBus implements IEventBus {
  /**
   * Subject for all events
   */
  private eventSubject = new Subject<EventData>();

  /**
   * Creates a new EventBus instance
   *
   * @param dispatcher - The event dispatcher
   */
  constructor(
    @inject(EventDispatcher.$) private dispatcher: EventDispatcher
  ) {
    // Subscribe to all events from the dispatcher
    this.dispatcher.getEventStream().subscribe(({ name, event }) => {
      this.eventSubject.next({
        name,
        payload: event,
        timestamp: Date.now()
      })
    })
  }

  /**
   * Get an observable of all events
   *
   * @returns An observable of all events
   */
  public events(): Observable<EventData> {
    return this.eventSubject.asObservable()
  }

  /**
   * Get an observable of events with a specific name
   *
   * @param eventName - The event name
   * @returns An observable of events with the specified name
   */
  public ofType(eventName: string): Observable<EventData> {
    return this.eventSubject.pipe(filter((event) => event.name === eventName))
  }

  /**
   * Get an observable of events of a specific class
   *
   * @param eventClass - The event class
   * @returns An observable of events of the specified class
   */
  public ofClass<T extends Event>(eventClass: new (...args: any[]) => T): Observable<EventData<T>> {
    const eventName = getEventName(eventClass)
    return this.ofType(eventName) as Observable<EventData<T>>
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
  public onEvent<T extends Event>(eventClass: new (...args: any[]) => T): Observable<T> {
    return this.ofClass(eventClass).pipe(map((event) => event.payload as T))
  }

  /**
   * Dispatch an event through the event bus
   *
   * @param event - The event to dispatch
   * @param payload - Optional payload if event is a string
   * @returns A promise that resolves when the event has been dispatched
   */
  public async dispatch(event: string | Event, payload?: any): Promise<any[]> {
    return this.dispatcher.dispatch(event, payload)
  }
}
