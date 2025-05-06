import { Option, Command, BaseCommand } from '@pixielity/ts-console';
import { IEventDispatcher, IQueueManager } from '@pixielity/ts-types';
import 'reflect-metadata';

/**
 * @pixielity/ts-events v1.0.0
 * 
 * Advanced TypeScript redis package
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// ../../../../node_modules/inversify/es/constants/metadata_keys.js
var NAMED_TAG = "named";
var INJECT_TAG = "inject";
var TAGGED = "inversify:tagged";
var TAGGED_PROP = "inversify:tagged_props";

// ../../../../node_modules/inversify/es/constants/error_msgs.js
var DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
var UNDEFINED_INJECT_ANNOTATION = function(name) {
  return "@inject called with undefined this could mean that the class " + name + " has a circular dependency problem. You can use a LazyServiceIdentifier to  overcome this limitation.";
};
var INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.";

// ../../../../node_modules/inversify/es/planning/metadata.js
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

// ../../../../node_modules/inversify/es/utils/js.js
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

// ../../../../node_modules/inversify/es/annotation/decorator_utils.js
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

// ../../../../node_modules/inversify/es/annotation/inject_base.js
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

// ../../../../node_modules/inversify/es/annotation/inject.js
var inject = injectBase(INJECT_TAG);
var eventRegistry = [];
function getEventClasses() {
  return [...eventRegistry];
}

// src/commands/event-command.ts
var EventCommand = class extends BaseCommand {
  /**
   * Creates a new EventCommand instance.
   *
   * @param dispatcher - The event dispatcher
   * @param queueManager - The queue manager
   */
  constructor(dispatcher, queueManager) {
    super();
    this.dispatcher = dispatcher;
    this.queueManager = queueManager;
  }
  /**
   * Configure the command.
   */
  configure() {
  }
  /**
   * Executes the command
   *
   * This method must be implemented by subclasses to provide
   * command-specific functionality.
   *
   * @returns {Promise<number | void>} The exit code or void
   */
  async execute() {
    const subCommand = this.getArgument("command") || "list";
    switch (subCommand) {
      case "list":
        return this.listEvents();
      case "process":
      // return this.processQueue(context.args[1])
      case "clear":
      // return this.clearQueue(context.args[1])
      default:
        this.error(`Unknown subcommand: ${subCommand}`);
        return 1;
    }
  }
  /**
   * List all registered events.
   */
  async listEvents() {
    const events = getEventClasses();
    if (events.length === 0) {
      this.info("No events registered");
      return;
    }
    this.info("Registered events:");
    for (const eventClass of events) {
      this.line(` - ${eventClass.name}`);
    }
  }
  /**
   * Process jobs in a queue.
   *
   * @param queue - The queue to process
   */
  async processQueue(queue) {
    try {
      const connection = this.queueManager.connection();
      if (!connection.process) {
        this.error("The current queue connection does not support processing");
        return;
      }
      this.info(`Processing queue: ${queue || "default"}`);
      await connection.process(queue);
      this.success("Queue processed successfully");
    } catch (error) {
      this.error(
        `Error processing queue: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Clear jobs in a queue.
   *
   * @param queue - The queue to clear
   */
  async clearQueue(queue) {
    try {
      const connection = this.queueManager.connection();
      if (!connection.clear) {
        this.error("The current queue connection does not support clearing");
        return;
      }
      this.info(`Clearing queue: ${queue || "default"}`);
      connection.clear(queue);
      this.success("Queue cleared successfully");
    } catch (error) {
      this.error(`Error clearing queue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};
__decorateClass([
  Option({
    flags: "-c, --command",
    description: "The sub command to call"
  })
], EventCommand.prototype, "command", 2);
EventCommand = __decorateClass([
  Command({
    name: "event",
    description: "Manage events and event listeners",
    shortcuts: [
      {
        flag: "-e",
        description: "Manage events and event listeners"
      }
    ]
  }),
  __decorateParam(0, inject(IEventDispatcher.$)),
  __decorateParam(1, inject(IQueueManager.$))
], EventCommand);
if (typeof module !== "undefined") { module.exports = module.exports.default; }

export { EventCommand };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map