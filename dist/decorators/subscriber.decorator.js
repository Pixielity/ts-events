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
var SUBSCRIBERS_METADATA_KEY = "tsevents:subscriber";

// src/decorators/subscriber.decorator.ts
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

exports.Subscriber = Subscriber;
//# sourceMappingURL=subscriber.decorator.js.map
//# sourceMappingURL=subscriber.decorator.js.map