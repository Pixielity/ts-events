'use strict';

require('reflect-metadata');

/**
 * @pixielity/ts-events v1.0.0
 * 
 * Advanced TypeScript redis package
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */


// src/constants/metadata.constants.ts
var EVENTS_METADATA_KEY = "tsevents:event";

// src/utils/reflection.util.ts
function getEventName(event) {
  if (typeof event === "object" && event !== null && typeof event.getEventName === "function") {
    return event.getEventName();
  }
  const target = typeof event === "object" ? event.constructor : event;
  const metadata = Reflect.getMetadata(EVENTS_METADATA_KEY, target);
  if (metadata && metadata.name) {
    return metadata.name;
  }
  return target.name;
}
var eventRegistry = [];
function registerEventClass(eventClass) {
  if (!eventRegistry.includes(eventClass)) {
    eventRegistry.push(eventClass);
  }
}
function getEventClasses() {
  return [...eventRegistry];
}
function isEvent(target) {
  return Reflect.hasMetadata(EVENTS_METADATA_KEY, target);
}
if (typeof module !== "undefined") { module.exports = module.exports.default; }

exports.getEventClasses = getEventClasses;
exports.getEventName = getEventName;
exports.isEvent = isEvent;
exports.registerEventClass = registerEventClass;
//# sourceMappingURL=reflection.util.js.map
//# sourceMappingURL=reflection.util.js.map