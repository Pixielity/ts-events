import 'reflect-metadata';

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
if (typeof module !== "undefined") { module.exports = module.exports.default; }

export { Event };
//# sourceMappingURL=event.decorator.mjs.map
//# sourceMappingURL=event.decorator.mjs.map