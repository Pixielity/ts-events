import { injectable, inject } from "inversify"
import { BaseCommand } from "./base-command"
import { EventDispatcher } from "../core/event-dispatcher"
import { QueueManager } from "../core/queue-manager"
import type { MemoryQueueConnection } from "../connections/memory-queue-connection"
import { getEventClasses } from "../utils/reflection.utils"

/**
 * Command for managing events and queues.
 */
@injectable()
export class EventCommand extends BaseCommand {
  /**
   * Creates a new EventCommand instance.
   *
   * @param dispatcher - The event dispatcher
   * @param queueManager - The queue manager
   */
  constructor(
    @inject(EventDispatcher.$) private dispatcher: EventDispatcher,
    @inject(QueueManager.$) private queueManager: QueueManager
  ) {
    super("event", "Manage events and event listeners")
  }

  /**
   * Configure the command.
   */
  public configure(): void {
    // Command configuration would go here
    // For example, defining arguments and options
  }

  /**
   * Execute the command.
   *
   * @param context - The command context
   */
  public async execute(context: any): Promise<number | void> {
    const subCommand = context.args[0] || "list"

    switch (subCommand) {
      case "list":
        return this.listEvents()
      case "process":
        return this.processQueue(context.args[1])
      case "clear":
        return this.clearQueue(context.args[1])
      default:
        this.error(`Unknown subcommand: ${subCommand}`)
        return 1
    }
  }

  /**
   * List all registered events.
   */
  private async listEvents(): Promise<void> {
    const events = getEventClasses()

    if (events.length === 0) {
      this.info("No events registered")
      return
    }

    this.info("Registered events:")

    for (const eventClass of events) {
      this.line(` - ${eventClass.name}`)
    }
  }

  /**
   * Process jobs in a queue.
   *
   * @param queue - The queue to process
   */
  private async processQueue(queue?: string): Promise<void> {
    try {
      const connection = this.queueManager.connection() as MemoryQueueConnection

      if (!connection.process) {
        this.error("The current queue connection does not support processing")
        return
      }

      this.info(`Processing queue: ${queue || "default"}`)
      await connection.process(queue)
      this.success("Queue processed successfully")
    } catch (error) {
      this.error(`Error processing queue: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Clear jobs in a queue.
   *
   * @param queue - The queue to clear
   */
  private async clearQueue(queue?: string): Promise<void> {
    try {
      const connection = this.queueManager.connection() as MemoryQueueConnection

      if (!connection.clear) {
        this.error("The current queue connection does not support clearing")
        return
      }

      this.info(`Clearing queue: ${queue || "default"}`)
      connection.clear(queue)
      this.success("Queue cleared successfully")
    } catch (error) {
      this.error(`Error clearing queue: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
