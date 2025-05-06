import 'reflect-metadata'
import type { IEvent } from '@pixielity/ts-types'

import { EVENTS_METADATA_KEY } from '../constants/metadata.constants'

/**
 * Get the event name from an event object or class.
 *
 * @param {Event | Function} event - The event object or class
 * @returns {string} The event name
 */
export function getEventName(event: IEvent | Function): string {
  // If it's an instance with getEventName method, use that
  if (
    typeof event === 'object' &&
    event !== null &&
    typeof (event as IEvent).getEventName === 'function'
  ) {
    return (event as IEvent).getEventName!()
  }

  // Get the constructor (if it's an instance) or the class itself
  const target = typeof event === 'object' ? event.constructor : event

  // Check for metadata
  const metadata = Reflect.getMetadata(EVENTS_METADATA_KEY, target)
  if (metadata && metadata.name) {
    return metadata.name
  }

  // Fallback to class name
  return target.name
}

// Registry to track decorated event classes
const eventRegistry: Function[] = []

/**
 * Register an event class in the registry.
 * This is called by the Event decorator.
 *
 * @param eventClass - The event class to register
 */
export function registerEventClass(eventClass: Function): void {
  if (!eventRegistry.includes(eventClass)) {
    eventRegistry.push(eventClass)
  }
}

/**
 * Get all registered event classes.
 *
 * @returns {Function[]} Array of event classes
 */
export function getEventClasses(): Function[] {
  return [...eventRegistry]
}

/**
 * Check if a class is an event.
 *
 * @param {Function} target - The class to check
 * @returns {boolean} True if the class is an event
 */
export function isEvent(target: Function): boolean {
  return Reflect.hasMetadata(EVENTS_METADATA_KEY, target)
}
