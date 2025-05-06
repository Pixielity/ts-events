import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IEventDispatcher } from '@pixielity/ts-types';
import 'reflect-metadata';

/**
 * @pixielity/ts-events v1.0.0
 * 
 * Advanced TypeScript redis package
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// ../../../node_modules/inversify/es/constants/metadata_keys.js
var NAMED_TAG = "named";
var INJECT_TAG = "inject";
var TAGGED = "inversify:tagged";
var TAGGED_PROP = "inversify:tagged_props";
var PARAM_TYPES = "inversify:paramtypes";
var DESIGN_PARAM_TYPES = "design:paramtypes";

// ../../../node_modules/inversify/es/constants/error_msgs.js
var DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";
var DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
var UNDEFINED_INJECT_ANNOTATION = function(name) {
  return "@inject called with undefined this could mean that the class " + name + " has a circular dependency problem. You can use a LazyServiceIdentifier to  overcome this limitation.";
};
var INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.";

// ../../../node_modules/inversify/es/planning/metadata.js
var Metadata = function() {
  function Metadata2(key, value) {
    this.key = key;
    this.value = value;
  }
  Metadata2.prototype.toString = function() {
    if (this.key === NAMED_TAG) {
      return "named: " + String(this.value).toString() + " ";
    } else {
      return "tagged: { key:" + this.key.toString() + ", value: " + String(this.value) + " }";
    }
  };
  return Metadata2;
}();

// ../../../node_modules/inversify/es/utils/js.js
function getFirstArrayDuplicate(array) {
  var seenValues = /* @__PURE__ */ new Set();
  for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
    var entry = array_1[_i];
    if (seenValues.has(entry)) {
      return entry;
    } else {
      seenValues.add(entry);
    }
  }
  return void 0;
}

// ../../../node_modules/inversify/es/annotation/decorator_utils.js
function targetIsConstructorFunction(target) {
  return target.prototype !== void 0;
}
function _throwIfMethodParameter(parameterName) {
  if (parameterName !== void 0) {
    throw new Error(INVALID_DECORATOR_OPERATION);
  }
}
function tagParameter(annotationTarget, parameterName, parameterIndex, metadata) {
  _throwIfMethodParameter(parameterName);
  _tagParameterOrProperty(TAGGED, annotationTarget, parameterIndex.toString(), metadata);
}
function tagProperty(annotationTarget, propertyName, metadata) {
  if (targetIsConstructorFunction(annotationTarget)) {
    throw new Error(INVALID_DECORATOR_OPERATION);
  }
  _tagParameterOrProperty(TAGGED_PROP, annotationTarget.constructor, propertyName, metadata);
}
function _ensureNoMetadataKeyDuplicates(metadata) {
  var metadatas = [];
  if (Array.isArray(metadata)) {
    metadatas = metadata;
    var duplicate = getFirstArrayDuplicate(metadatas.map(function(md) {
      return md.key;
    }));
    if (duplicate !== void 0) {
      throw new Error(DUPLICATED_METADATA + " " + duplicate.toString());
    }
  } else {
    metadatas = [metadata];
  }
  return metadatas;
}
function _tagParameterOrProperty(metadataKey, annotationTarget, key, metadata) {
  var metadatas = _ensureNoMetadataKeyDuplicates(metadata);
  var paramsOrPropertiesMetadata = {};
  if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
    paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
  }
  var paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
  if (paramOrPropertyMetadata === void 0) {
    paramOrPropertyMetadata = [];
  } else {
    var _loop_1 = function(m2) {
      if (metadatas.some(function(md) {
        return md.key === m2.key;
      })) {
        throw new Error(DUPLICATED_METADATA + " " + m2.key.toString());
      }
    };
    for (var _i = 0, paramOrPropertyMetadata_1 = paramOrPropertyMetadata; _i < paramOrPropertyMetadata_1.length; _i++) {
      var m = paramOrPropertyMetadata_1[_i];
      _loop_1(m);
    }
  }
  paramOrPropertyMetadata.push.apply(paramOrPropertyMetadata, metadatas);
  paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
  Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
}
function createTaggedDecorator(metadata) {
  return function(target, targetKey, indexOrPropertyDescriptor) {
    if (typeof indexOrPropertyDescriptor === "number") {
      tagParameter(target, targetKey, indexOrPropertyDescriptor, metadata);
    } else {
      tagProperty(target, targetKey, metadata);
    }
  };
}

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

// ../../../node_modules/inversify/es/annotation/inject_base.js
function injectBase(metadataKey) {
  return function(serviceIdentifier) {
    return function(target, targetKey, indexOrPropertyDescriptor) {
      if (serviceIdentifier === void 0) {
        var className = typeof target === "function" ? target.name : target.constructor.name;
        throw new Error(UNDEFINED_INJECT_ANNOTATION(className));
      }
      return createTaggedDecorator(new Metadata(metadataKey, serviceIdentifier))(target, targetKey, indexOrPropertyDescriptor);
    };
  };
}

// ../../../node_modules/inversify/es/annotation/inject.js
var inject = injectBase(INJECT_TAG);

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

// src/event-bus.ts
var EventBus = class {
  /**
   * Creates a new EventBus instance
   *
   * @param dispatcher - The event dispatcher
   */
  constructor(dispatcher) {
    /**
     * Subject for all events
     */
    this.eventSubject = new Subject();
    this.dispatcher = dispatcher;
    this.dispatcher.getEventStream().subscribe(({ name, event }) => {
      this.eventSubject.next({
        name,
        payload: event,
        timestamp: Date.now()
      });
    });
  }
  /**
   * Get an observable of all events
   *
   * @returns An observable of all events
   */
  events() {
    return this.eventSubject.asObservable();
  }
  /**
   * Get an observable of events with a specific name
   *
   * @param eventName - The event name
   * @returns An observable of events with the specified name
   */
  ofType(eventName) {
    return this.eventSubject.pipe(filter((event) => event.name === eventName));
  }
  /**
   * Get an observable of events of a specific class
   *
   * @param eventClass - The event class
   * @returns An observable of events of the specified class
   */
  ofClass(eventClass) {
    const eventName = getEventName(eventClass);
    return this.ofType(eventName);
  }
  /**
   * Get an observable of event payloads with a specific name
   *
   * @param eventName - The event name
   * @returns An observable of event payloads with the specified name
   */
  on(eventName) {
    return this.ofType(eventName).pipe(map((event) => event.payload));
  }
  /**
   * Get an observable of event payloads of a specific class
   *
   * @param eventClass - The event class
   * @returns An observable of event payloads of the specified class
   */
  onEvent(eventClass) {
    return this.ofClass(eventClass).pipe(map((event) => event.payload));
  }
  /**
   * Subscribe to an event with a listener
   *
   * @param event - The event name or class
   * @param listener - The listener function or object
   * @returns A function to unsubscribe
   */
  subscribe(event, listener) {
    const eventName = typeof event === "string" ? event : getEventName(event);
    return this.dispatcher.listen(eventName, listener);
  }
  /**
   * Subscribe to an event with a typed listener
   *
   * @param eventClass - The event class
   * @param listener - The listener function
   * @returns A function to unsubscribe
   */
  subscribeToEvent(eventClass, listener) {
    return this.dispatcher.listen(getEventName(eventClass), listener);
  }
  /**
   * Dispatch an event through the event bus
   *
   * @param event - The event to dispatch
   * @param payload - Optional payload if event is a string
   * @returns A promise that resolves when the event has been dispatched
   */
  async dispatch(event, payload) {
    return this.dispatcher.dispatch(event, payload);
  }
};
EventBus = __decorateClass([
  injectable(),
  __decorateParam(0, inject(IEventDispatcher.$))
], EventBus);
if (typeof module !== "undefined") { module.exports = module.exports.default; }

export { EventBus };
//# sourceMappingURL=event-bus.mjs.map
//# sourceMappingURL=event-bus.mjs.map