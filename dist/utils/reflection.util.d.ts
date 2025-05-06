import { IEvent } from '@pixielity/ts-types';

/**
 * Get the event name from an event object or class.
 *
 * @param {Event | Function} event - The event object or class
 * @returns {string} The event name
 */
declare function getEventName(event: IEvent | Function): string;
/**
 * Register an event class in the registry.
 * This is called by the Event decorator.
 *
 * @param eventClass - The event class to register
 */
declare function registerEventClass(eventClass: Function): void;
/**
 * Get all registered event classes.
 *
 * @returns {Function[]} Array of event classes
 */
declare function getEventClasses(): Function[];
/**
 * Check if a class is an event.
 *
 * @param {Function} target - The class to check
 * @returns {boolean} True if the class is an event
 */
declare function isEvent(target: Function): boolean;

export { getEventClasses, getEventName, isEvent, registerEventClass };
