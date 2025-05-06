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

var PARAM_TYPES = "inversify:paramtypes";
var DESIGN_PARAM_TYPES = "design:paramtypes";

// ../../../node_modules/inversify/es/constants/error_msgs.js
var DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";

// ../../../node_modules/inversify/es/annotation/injectable.js
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

// src/constants/metadata.constants.ts
var LISTENERS_METADATA_KEY = "tsevents:listener";

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
if (typeof module !== "undefined") { module.exports = module.exports.default; }

exports.Listener = Listener;
//# sourceMappingURL=listener.decorator.js.map
//# sourceMappingURL=listener.decorator.js.map