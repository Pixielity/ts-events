'use strict';

var operators = require('rxjs/operators');
var rxjs = require('rxjs');
require('reflect-metadata');
var tsApplication = require('@pixielity/ts-application');
var tsTypes = require('@pixielity/ts-types');

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
var OPTIONAL_TAG = "optional";
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

// ../../../node_modules/inversify/es/annotation/optional.js
function optional() {
  return createTaggedDecorator(new Metadata(OPTIONAL_TAG, true));
}

// src/constants/metadata.constants.ts
var EVENTS_METADATA_KEY = "tsevents:event";
var LISTENERS_METADATA_KEY = "tsevents:listener";
var SUBSCRIBERS_METADATA_KEY = "tsevents:subscriber";

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
function getEventClasses() {
  return [...eventRegistry];
}
function isEvent(target) {
  return Reflect.hasMetadata(EVENTS_METADATA_KEY, target);
}

// src/event-dispatcher.ts
var QUEUE_MANAGER_TOKEN = Symbol.for("QueueManager");
exports.EventDispatcher = class EventDispatcher {
  /**
   * Creates a new EventDispatcher instance.
   *
   * @param {QueueManager} [queueManager] - Optional queue manager for queueable events
   */
  constructor(queueManager) {
    /**
     * Map of event names to listeners.
     */
    this.listeners = /* @__PURE__ */ new Map();
    /**
     * Subject for broadcasting events
     */
    this.eventSubject = new rxjs.Subject();
    /**
     * Subject for broadcasting events with name and payload
     */
    this.eventStreamSubject = new rxjs.Subject();
    this.queueManager = queueManager;
  }
  /**
   * [listenerCount description]
   *
   * @param   {string}  eventName  [eventName description]
   *
   * @return  {number}             [return description]
   */
  listenerCount(eventName) {
    var _a, _b;
    return (_b = (_a = this.listeners.get(eventName)) == null ? void 0 : _a.length) != null ? _b : 0;
  }
  /**
   * Register an event listener with the dispatcher.
   *
   * @param {string} event - The event name
   * @param {Listener | Function} listener - The listener function or object
   * @returns {() => void} A function to remove the listener
   */
  listen(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index !== -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }
  /**
   * Determine if a given event has listeners.
   *
   * @param {string} eventName - The event name
   * @returns {boolean} True if the event has listeners
   */
  hasListeners(eventName) {
    const listeners = this.listeners.get(eventName);
    return !!listeners && listeners.length > 0;
  }
  /**
   * Register an event subscriber with the dispatcher.
   *
   * @param {Subscriber} subscriber - The subscriber to register
   */
  subscribe(subscriber) {
    subscriber.subscribe(this);
  }
  /**
   * Dispatch an event and call the listeners.
   *
   * @param {string | Event} event - The event name or object
   * @param {any} [payload] - The event payload (if event is a string)
   * @returns {Promise<any[]>} Array of results from the listeners
   */
  async dispatch(event, payload) {
    const eventName = typeof event === "string" ? event : getEventName(event);
    const eventObject = typeof event === "string" ? payload : event;
    this.eventSubject.next({
      name: eventName,
      payload: eventObject,
      timestamp: Date.now()
    });
    this.eventStreamSubject.next({
      name: eventName,
      event: eventObject
    });
    if (this.queueManager && this.isQueueable(eventObject)) {
      await this.queueEvent(eventObject);
      return [];
    }
    const eventListeners = this.listeners.get(eventName) || [];
    const results = [];
    for (const listener of eventListeners) {
      try {
        let result;
        if (typeof listener === "function") {
          result = await listener(eventObject);
        } else {
          if (this.queueManager && this.isQueueable(listener)) {
            await this.queueListener(listener, eventObject);
            continue;
          }
          result = await listener.handle(eventObject);
        }
        results.push(result);
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error);
        throw error;
      }
    }
    return results;
  }
  /**
   * Dispatch an event and halt when the first listener returns a non-null response.
   *
   * @param {string | Event} event - The event name or object
   * @param {any} [payload] - The event payload (if event is a string)
   * @returns {Promise<any>} The first non-null response or null
   */
  async until(event, payload) {
    const eventName = typeof event === "string" ? event : getEventName(event);
    const eventObject = typeof event === "string" ? payload : event;
    this.eventSubject.next({
      name: eventName,
      payload: eventObject,
      timestamp: Date.now()
    });
    this.eventStreamSubject.next({
      name: eventName,
      event: eventObject
    });
    const eventListeners = this.listeners.get(eventName) || [];
    for (const listener of eventListeners) {
      try {
        let result;
        if (typeof listener === "function") {
          result = await listener(eventObject);
        } else {
          result = await listener.handle(eventObject);
        }
        if (result !== null && result !== void 0) {
          return result;
        }
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error);
        throw error;
      }
    }
    return null;
  }
  /**
   * Remove a set of listeners from the dispatcher.
   *
   * @param {string} event - The event name
   */
  forget(event) {
    this.listeners.delete(event);
  }
  /**
   * Remove all listeners from the dispatcher.
   */
  forgetAll() {
    this.listeners.clear();
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
   * Get an observable of all events with their names
   *
   * @returns An observable of events with their names
   */
  getEventStream() {
    return this.eventStreamSubject.asObservable();
  }
  /**
   * Get an observable of events with a specific name
   *
   * @param eventName - The event name
   * @returns An observable of events with the specified name
   */
  ofType(eventName) {
    return this.eventSubject.pipe(operators.filter((event) => event.name === eventName));
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
    return this.ofType(eventName).pipe(operators.map((event) => event.payload));
  }
  /**
   * Get an observable of event payloads of a specific class
   *
   * @param eventClass - The event class
   * @returns An observable of event payloads of the specified class
   */
  onEvent(eventClass) {
    return this.ofClass(eventClass).pipe(operators.map((event) => event.payload));
  }
  /**
   * Check if an object is queueable.
   *
   * @param obj - The object to check
   * @returns True if the object is queueable
   * @private
   */
  isQueueable(obj) {
    if (!obj) return false;
    return typeof obj.shouldQueue === "function";
  }
  /**
   * Queue an event for later processing.
   *
   * @param event - The queueable event
   * @returns Promise resolving when the event is queued
   * @private
   */
  async queueEvent(event) {
    var _a, _b, _c;
    if (!this.queueManager) {
      throw new Error("Queue manager is not configured");
    }
    const delay = ((_a = event.delay) == null ? void 0 : _a.call(event)) || 0;
    const connection = ((_b = event.connection) == null ? void 0 : _b.call(event)) || null;
    const queue = ((_c = event.queue) == null ? void 0 : _c.call(event)) || null;
    if (delay > 0) {
      await this.queueManager.later(delay, event, {}, connection, queue);
    } else {
      await this.queueManager.push(event, {}, connection, queue);
    }
  }
  /**
   * Queue a listener for later processing.
   *
   * @param listener - The queueable listener
   * @param event - The event to handle
   * @returns Promise resolving when the listener is queued
   * @private
   */
  async queueListener(listener, event) {
    var _a, _b, _c;
    if (!this.queueManager) {
      throw new Error("Queue manager is not configured");
    }
    const delay = ((_a = listener.delay) == null ? void 0 : _a.call(listener)) || 0;
    const connection = ((_b = listener.connection) == null ? void 0 : _b.call(listener)) || null;
    const queue = ((_c = listener.queue) == null ? void 0 : _c.call(listener)) || null;
    if (delay > 0) {
      await this.queueManager.later(delay, listener, { event }, connection, queue);
    } else {
      await this.queueManager.push(listener, { event }, connection, queue);
    }
  }
};
exports.EventDispatcher = __decorateClass([
  injectable(),
  __decorateParam(0, inject(QUEUE_MANAGER_TOKEN)),
  __decorateParam(0, optional())
], exports.EventDispatcher);
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
exports.EventServiceProvider = class EventServiceProvider extends tsApplication.ServiceProvider {
  constructor() {
    super(...arguments);
    /**
     * Array of subscriber classes to register.
     */
    this.subscribers = [];
  }
  /**
   * Register any application services.
   * This method is called when the service provider is registered with the container.
   */
  register() {
    if (!this.app.isBound(tsTypes.IEventDispatcher.$)) {
      this.app.bind(tsTypes.IEventDispatcher.$).to(exports.EventDispatcher).inSingletonScope();
    }
    this.registerSubscribers();
  }
  /**
   * Bootstrap any application services.
   * This method is called after all service providers have been registered.
   */
  boot() {
    const dispatcher = this.app.make(tsTypes.IEventDispatcher.$);
    for (const SubscriberClass of this.subscribers) {
      try {
        const subscriber = this.app.resolve(SubscriberClass);
        dispatcher.subscribe(subscriber);
      } catch (error) {
        console.error(`Error initializing subscriber ${SubscriberClass.name}:`, error);
      }
    }
  }
  /**
   * Register a subscriber class.
   *
   * @param {new () => Subscriber} subscriberClass - The subscriber class to register
   */
  registerSubscriber(subscriberClass) {
    if (!Reflect.hasMetadata(SUBSCRIBERS_METADATA_KEY, subscriberClass)) {
      throw new Error(`Class ${subscriberClass.name} is not a valid subscriber`);
    }
    this.subscribers.push(subscriberClass);
    if (!this.app.isBound(subscriberClass)) {
      this.app.bind(subscriberClass).toSelf();
    }
  }
  /**
   * Register multiple subscriber classes.
   *
   * @param {Array<new () => Subscriber>} subscriberClasses - The subscriber classes to register
   */
  registerSubscribers(subscriberClasses) {
    if (subscriberClasses) {
      for (const subscriberClass of subscriberClasses) {
        this.registerSubscriber(subscriberClass);
      }
    }
  }
  /**
   * Get the event dispatcher instance.
   *
   * @returns {EventDispatcher} The event dispatcher
   */
  getDispatcher() {
    return this.app.make(tsTypes.IEventDispatcher.$);
  }
};
exports.EventServiceProvider = __decorateClass([
  injectable()
], exports.EventServiceProvider);
if (typeof module !== "undefined") { module.exports = module.exports.default; }

exports.EventDecorator = Event;
exports.ListenerDecorator = Listener;
exports.QUEUE_MANAGER_TOKEN = QUEUE_MANAGER_TOKEN;
exports.SubscriberDecorator = Subscriber;
exports.getEventClasses = getEventClasses;
exports.getEventName = getEventName;
exports.isEvent = isEvent;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map