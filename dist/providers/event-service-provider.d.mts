import { ServiceProvider } from '@pixielity/ts-application';
import { ISubscriber, IEventDispatcher } from '@pixielity/ts-types';

/**
 * Service provider for the event system.
 * Handles registration of event-related services and subscribers.
 */
declare class EventServiceProvider extends ServiceProvider {
    /**
     * Array of subscriber classes to register.
     */
    private subscribers;
    /**
     * Register any application services.
     * This method is called when the service provider is registered with the container.
     */
    register(): void;
    /**
     * Bootstrap any application services.
     * This method is called after all service providers have been registered.
     */
    boot(): void;
    /**
     * Register a subscriber class.
     *
     * @param {new () => Subscriber} subscriberClass - The subscriber class to register
     */
    registerSubscriber(subscriberClass: new () => ISubscriber): void;
    /**
     * Register multiple subscriber classes.
     *
     * @param {Array<new () => Subscriber>} subscriberClasses - The subscriber classes to register
     */
    registerSubscribers(subscriberClasses?: Array<new () => ISubscriber>): void;
    /**
     * Get the event dispatcher instance.
     *
     * @returns {EventDispatcher} The event dispatcher
     */
    getDispatcher(): IEventDispatcher;
}

export { EventServiceProvider };
