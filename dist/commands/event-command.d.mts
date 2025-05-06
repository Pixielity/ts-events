import { BaseCommand } from '@pixielity/ts-console';
import { IEventDispatcher, IQueueManager } from '@pixielity/ts-types';

/**
 * Command for managing events and queues.
 */
declare class EventCommand extends BaseCommand {
    private dispatcher;
    private queueManager;
    /**
     * The uppercase option
     */
    private command;
    /**
     * Creates a new EventCommand instance.
     *
     * @param dispatcher - The event dispatcher
     * @param queueManager - The queue manager
     */
    constructor(dispatcher: IEventDispatcher, queueManager: IQueueManager);
    /**
     * Configure the command.
     */
    configure(): void;
    /**
     * Executes the command
     *
     * This method must be implemented by subclasses to provide
     * command-specific functionality.
     *
     * @returns {Promise<number | void>} The exit code or void
     */
    execute(): Promise<number | void>;
    /**
     * List all registered events.
     */
    private listEvents;
    /**
     * Process jobs in a queue.
     *
     * @param queue - The queue to process
     */
    private processQueue;
    /**
     * Clear jobs in a queue.
     *
     * @param queue - The queue to clear
     */
    private clearQueue;
}

export { EventCommand };
