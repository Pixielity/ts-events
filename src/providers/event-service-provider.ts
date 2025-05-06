import { injectable } from 'inversify'
import { ServiceProvider } from '@pixielity/ts-application'
import { type ISubscriber, IEventDispatcher, IQueueManager } from '@pixielity/ts-types'

import { EventDispatcher, QUEUE_MANAGER_TOKEN } from '../event-dispatcher'
import { SUBSCRIBERS_METADATA_KEY } from '../constants/metadata.constants'

/**
 * Service provider for the event system.
 * Handles registration of event-related services and subscribers.
 */
@injectable()
export class EventServiceProvider extends ServiceProvider {
  /**
   * Array of subscriber classes to register.
   */
  private subscribers: (new () => ISubscriber)[] = []

  /**
   * Register any application services.
   * This method is called when the service provider is registered with the container.
   */
  public register(): void {
    // Register the event dispatcher
    if (!this.app.isBound(IEventDispatcher.$)) {
      this.app.singleton(IEventDispatcher.$, EventDispatcher)
    }

    // Find and register all subscribers
    this.registerSubscribers()
  }

  /**
   * Bootstrap any application services.
   * This method is called after all service providers have been registered.
   */
  public boot(): void {
    const dispatcher = this.app.make<IEventDispatcher>(IEventDispatcher.$)

    // Initialize all subscribers
    for (const SubscriberClass of this.subscribers) {
      try {
        const subscriber = this.app.resolve<ISubscriber>(SubscriberClass)
        dispatcher.subscribe(subscriber)
      } catch (error) {
        console.error(`Error initializing subscriber ${SubscriberClass.name}:`, error)
      }
    }
  }

  /**
   * Register a subscriber class.
   *
   * @param {new () => Subscriber} subscriberClass - The subscriber class to register
   */
  public registerSubscriber(subscriberClass: new () => ISubscriber): void {
    // Ensure the class has the subscriber metadata
    if (!Reflect.hasMetadata(SUBSCRIBERS_METADATA_KEY, subscriberClass)) {
      throw new Error(`Class ${subscriberClass.name} is not a valid subscriber`)
    }

    this.subscribers.push(subscriberClass)

    // Bind the subscriber to the container if not already bound
    if (!this.app.isBound(subscriberClass)) {
      this.app.bind(subscriberClass)
    }
  }

  /**
   * Register multiple subscriber classes.
   *
   * @param {Array<new () => Subscriber>} subscriberClasses - The subscriber classes to register
   */
  public registerSubscribers(subscriberClasses?: Array<new () => ISubscriber>): void {
    if (subscriberClasses) {
      for (const subscriberClass of subscriberClasses) {
        this.registerSubscriber(subscriberClass)
      }
    }
  }

  /**
   * Get the event dispatcher instance.
   *
   * @returns {EventDispatcher} The event dispatcher
   */
  public getDispatcher(): IEventDispatcher {
    return this.app.make<IEventDispatcher>(IEventDispatcher.$)
  }
}
