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
var LISTENERS_METADATA_KEY = "tsevents:listener";
var SUBSCRIBERS_METADATA_KEY = "tsevents:subscriber";

// src/decorators/event.decorator.ts
function Event(options = {}) {
  return (target) => {
    Reflect.defineMetadata(
      EVENTS_METADATA_KEY,
      {
        name: options.name || target.name,
        broadcast: options.broadcast || false,
        channels: options.channels || [],
        target
      },
      target
    );
    if (!target.prototype.getEventName) {
      target.prototype.getEventName = () => options.name || target.name;
    }
    if (!target.prototype.shouldBroadcast && options.broadcast !== void 0) {
      target.prototype.shouldBroadcast = () => options.broadcast;
    }
    if (!target.prototype.broadcastOn && options.channels) {
      target.prototype.broadcastOn = () => options.channels;
    }
  };
}
var PARAM_TYPES = "inversify:paramtypes";
var DESIGN_PARAM_TYPES = "design:paramtypes";

// ../../../../node_modules/inversify/es/constants/error_msgs.js
var DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";

// ../../../../node_modules/inversify/es/annotation/injectable.js
function injectable() {
  return function(target) {
    if (Reflect.hasOwnMetadata(PARAM_TYPES, target)) {
      throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
    }
    var types = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
    Reflect.defineMetadata(PARAM_TYPES, types, target);
    return target;
  };
}

// src/decorators/listener.decorator.ts
function Listener(options) {
  return (target) => {
    injectable()(target);
    const events = Array.isArray(options.event) ? options.event : [options.event];
    Reflect.defineMetadata(
      LISTENERS_METADATA_KEY,
      {
        events,
        queued: options.queued || false,
        delay: options.delay || 0,
        connection: options.connection || null,
        queue: options.queue || null,
        target
      },
      target
    );
    if (options.queued) {
      if (!target.prototype.shouldQueue) {
        target.prototype.shouldQueue = () => true;
      }
      if (!target.prototype.connection) {
        target.prototype.connection = () => options.connection || null;
      }
      if (!target.prototype.queue) {
        target.prototype.queue = () => options.queue || null;
      }
      if (!target.prototype.delay) {
        target.prototype.delay = () => options.delay || 0;
      }
    }
    return target;
  };
}
function Subscriber() {
  return (target) => {
    injectable()(target);
    Reflect.defineMetadata(
      SUBSCRIBERS_METADATA_KEY,
      {
        target
      },
      target
    );
    return target;
  };
}
if (typeof module !== "undefined") { module.exports = module.exports.default; }

exports.Event = Event;
exports.Listener = Listener;
exports.Subscriber = Subscriber;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map