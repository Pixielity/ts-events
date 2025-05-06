// Core exports
export type { EventData } from './event-dispatcher'
export { EventDispatcher, QUEUE_MANAGER_TOKEN } from './event-dispatcher'

// Decorator exports
export type { EventOptions } from './decorators/event.decorator'
export { Event as EventDecorator } from './decorators/event.decorator'
export type { ListenerOptions } from './decorators/listener.decorator'
export { Listener as ListenerDecorator } from './decorators/listener.decorator'
export { Subscriber as SubscriberDecorator } from './decorators/subscriber.decorator'

// Provider exports
export { EventServiceProvider } from './providers/event-service-provider'

// Utility exports
export { getEventName, isEvent, getEventClasses } from './utils/reflection.util'
