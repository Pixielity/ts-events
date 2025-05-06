import type {
  IEventDispatcher,
  IEvent,
  IListener,
  ISubscriber,
  IQueueManager,
} from '@pixielity/ts-types'
import { filter, map } from 'rxjs/operators'
import { Subject, type Observable } from 'rxjs'
import { injectable, inject, optional } from 'inversify'

import { getEventName } from './utils/reflection.util'

/**
 * Event data structure for the event stream
 */
export interface EventData<T = any> {
  /**
   * The name of the event
   */
  name: string

  /**
   * The event payload
   */
  payload: T

  /**
   * The timestamp when the event was dispatched
   */
  timestamp: number
}

/**
 * Symbol for the queue manager dependency injection token
 */
export const QUEUE_MANAGER_TOKEN = Symbol.for('QueueManager')

/**
 * The main event dispatcher implementation.
 * Responsible for registering listeners and dispatching events.
 * Also provides reactive event handling capabilities.
 */
@injectable()
export class EventDispatcher implements IEventDispatcher {
  /**
   * Map of event names to listeners.
   */
  private listeners: Map<string, Array<IListener | Function>> = new Map()

  /**
   * Subject for broadcasting events
   */
  private eventSubject = new Subject<EventData>()

  /**
   * Subject for broadcasting events with name and payload
   */
  private eventStreamSubject = new Subject<{ name: string; event: any }>()

  /**
   * Queue manager instance.
   */
  private queueManager?: IQueueManager

  /**
   * Creates a new EventDispatcher instance.
   *
   * @param {QueueManager} [queueManager] - Optional queue manager for queueable events
   */
  constructor(@inject(QUEUE_MANAGER_TOKEN) @optional() queueManager?: IQueueManager) {
    this.queueManager = queueManager
  }

  /**
   * [listenerCount description]
   *
   * @param   {string}  eventName  [eventName description]
   *
   * @return  {number}             [return description]
   */
  public listenerCount(eventName: string): number {
    return this.listeners.get(eventName)?.length ?? 0
  }

  /**
   * Register an event listener with the dispatcher.
   *
   * @param {string} event - The event name
   * @param {Listener | Function} listener - The listener function or object
   * @returns {() => void} A function to remove the listener
   */
  public listen(event: string, listener: IListener | Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }

    this.listeners.get(event)!.push(listener)

    // Return a function to remove this listener
    return () => {
      const eventListeners = this.listeners.get(event)
      if (eventListeners) {
        const index = eventListeners.indexOf(listener)
        if (index !== -1) {
          eventListeners.splice(index, 1)
        }
      }
    }
  }

  /**
   * Determine if a given event has listeners.
   *
   * @param {string} eventName - The event name
   * @returns {boolean} True if the event has listeners
   */
  public hasListeners(eventName: string): boolean {
    const listeners = this.listeners.get(eventName)
    return !!listeners && listeners.length > 0
  }

  /**
   * Register an event subscriber with the dispatcher.
   *
   * @param {Subscriber} subscriber - The subscriber to register
   */
  public subscribe(subscriber: ISubscriber): void {
    subscriber.subscribe(this as IEventDispatcher)
  }

  /**
   * Dispatch an event and call the listeners.
   *
   * @param {string | Event} event - The event name or object
   * @param {any} [payload] - The event payload (if event is a string)
   * @returns {Promise<any[]>} Array of results from the listeners
   */
  public async dispatch(event: string | IEvent, payload?: any): Promise<any[]> {
    const eventName = typeof event === 'string' ? event : getEventName(event)
    const eventObject = typeof event === 'string' ? payload : event

    // Emit to the event stream
    this.eventSubject.next({
      name: eventName,
      payload: eventObject,
      timestamp: Date.now(),
    })

    // Emit to the event stream with name and event
    this.eventStreamSubject.next({
      name: eventName,
      event: eventObject,
    })

    // Check if the event is queueable and we have a queue manager
    if (this.queueManager && this.isQueueable(eventObject)) {
      await this.queueEvent(eventObject)
      return []
    }

    // Get listeners for this event
    const eventListeners = this.listeners.get(eventName) || []

    // Execute all listeners and collect results
    const results: any[] = []

    for (const listener of eventListeners) {
      try {
        let result: any

        if (typeof listener === 'function') {
          result = await listener(eventObject)
        } else {
          // Check if the listener is queueable and we have a queue manager
          if (this.queueManager && this.isQueueable(listener)) {
            await this.queueListener(listener, eventObject)
            continue
          }

          result = await listener.handle(eventObject)
        }

        results.push(result)
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error)
        throw error
      }
    }

    return results
  }

  /**
   * Dispatch an event and halt when the first listener returns a non-null response.
   *
   * @param {string | Event} event - The event name or object
   * @param {any} [payload] - The event payload (if event is a string)
   * @returns {Promise<any>} The first non-null response or null
   */
  public async until(event: string | IEvent, payload?: any): Promise<any> {
    const eventName = typeof event === 'string' ? event : getEventName(event)
    const eventObject = typeof event === 'string' ? payload : event

    // Emit to the event stream
    this.eventSubject.next({
      name: eventName,
      payload: eventObject,
      timestamp: Date.now(),
    })

    // Emit to the event stream with name and event
    this.eventStreamSubject.next({
      name: eventName,
      event: eventObject,
    })

    // Get listeners for this event
    const eventListeners = this.listeners.get(eventName) || []

    for (const listener of eventListeners) {
      try {
        let result: any

        if (typeof listener === 'function') {
          result = await listener(eventObject)
        } else {
          // We don't queue listeners in until() since we need the result
          result = await listener.handle(eventObject)
        }

        if (result !== null && result !== undefined) {
          return result
        }
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error)
        throw error
      }
    }

    return null
  }

  /**
   * Remove a set of listeners from the dispatcher.
   *
   * @param {string} event - The event name
   */
  public forget(event: string): void {
    this.listeners.delete(event)
  }

  /**
   * Remove all listeners from the dispatcher.
   */
  public forgetAll(): void {
    this.listeners.clear()
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
   * Get an observable of all events with their names
   *
   * @returns An observable of events with their names
   */
  public getEventStream(): Observable<{ name: string; event: any }> {
    return this.eventStreamSubject.asObservable()
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
  public ofClass<T extends IEvent>(
    eventClass: new (...args: any[]) => T,
  ): Observable<EventData<T>> {
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
  public onEvent<T extends IEvent>(eventClass: new (...args: any[]) => T): Observable<T> {
    return this.ofClass(eventClass).pipe(map((event) => event.payload as T))
  }

  /**
   * Check if an object is queueable.
   *
   * @param obj - The object to check
   * @returns True if the object is queueable
   * @private
   */
  private isQueueable(obj: any): boolean {
    if (!obj) return false

    // Check if the object implements ShouldQueue interface
    return typeof obj.shouldQueue === 'function'
  }

  /**
   * Queue an event for later processing.
   *
   * @param event - The queueable event
   * @returns Promise resolving when the event is queued
   * @private
   */
  private async queueEvent(event: any): Promise<void> {
    if (!this.queueManager) {
      throw new Error('Queue manager is not configured')
    }

    const delay = event.delay?.() || 0
    const connection = event.connection?.() || null
    const queue = event.queue?.() || null

    if (delay > 0) {
      await this.queueManager.later(delay, event, {}, connection, queue)
    } else {
      await this.queueManager.push(event, {}, connection, queue)
    }
  }

  /**
   * Queue a listener for later processing.
   *
   * @param listener - The queueable listener
   * @param event - The event to handle
   * @returns Promise resolving when the listener is queued
   * @private
   */
  private async queueListener(listener: any, event: IEvent): Promise<void> {
    if (!this.queueManager) {
      throw new Error('Queue manager is not configured')
    }

    const delay = listener.delay?.() || 0
    const connection = listener.connection?.() || null
    const queue = listener.queue?.() || null

    if (delay > 0) {
      await this.queueManager.later(delay, listener, { event }, connection, queue)
    } else {
      await this.queueManager.push(listener, { event }, connection, queue)
    }
  }
}
