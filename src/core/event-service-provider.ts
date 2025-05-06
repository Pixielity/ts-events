import { EventDispatcher } from "./event-dispatcher"
import type { Subscriber } from "../interfaces/subscriber.interface"
import type { QueueManager } from "./queue-manager"

/**
 * Service provider for the event system.
 * Handles registration of subscribers and configuration of the event dispatcher.
 */
export class EventServiceProvider {
  /**
   * The event dispatcher instance.
   */
  private dispatcher: EventDispatcher

  /**
   * Array of subscriber classes to register.
   */
  private subscribers: (new () => Subscriber)[] = []

  /**
   * Creates a new EventServiceProvider instance.
   *
   * @param {QueueManager} [queueManager] - Optional queue manager for queueable events
   */
  constructor(queueManager?: QueueManager) {
    this.dispatcher = new EventDispatcher(queueManager)
  }

  /**
   * Register a subscriber class.
   *
   * @param {new () => Subscriber} subscriberClass - The subscriber class to register
   */
  public register(subscriberClass: new () => Subscriber): void {
    this.subscribers.push(subscriberClass)
  }

  /**
   * Register multiple subscriber classes.
   *
   * @param {Array<new () => Subscriber>} subscriberClasses - The subscriber classes to register
   */
  public registerMany(subscriberClasses: Array<new () => Subscriber>): void {
    this.subscribers.push(...subscriberClasses)
  }

  /**
   * Boot the service provider.
   * This initializes all registered subscribers.
   */
  public boot(): void {
    for (const SubscriberClass of this.subscribers) {
      const subscriber = new SubscriberClass()
      this.dispatcher.subscribe(subscriber)
    }
  }

  /**
   * Get the event dispatcher instance.
   *
   * @returns {EventDispatcher} The event dispatcher
   */
  public getDispatcher(): EventDispatcher {
    return this.dispatcher
  }
}
