import { injectable, inject } from 'inversify'
import { BaseCommand, Command, Option } from '@pixielity/ts-console'
import { IEventDispatcher, IQueueConnection, IQueueManager } from '@pixielity/ts-types'

import { getEventClasses } from '../utils/reflection.util'

/**
 * Command for managing events and queues.
 */
@Command({
  name: 'event',
  description: 'Manage events and event listeners',
  shortcuts: [
    {
      flag: '-e',
      description: 'Manage events and event listeners',
    },
  ],
})
export class EventCommand extends BaseCommand {
  /**
   * The uppercase option
   */
  @Option({
    flags: '-c, --command',
    description: 'The sub command to call',
  })
  private command!: boolean

  /**
   * Creates a new EventCommand instance.
   *
   * @param dispatcher - The event dispatcher
   * @param queueManager - The queue manager
   */
  constructor(
    @inject(IEventDispatcher.$) private dispatcher: IEventDispatcher,
    @inject(IQueueManager.$) private queueManager: IQueueManager,
  ) {
    super()
  }

  /**
   * Configure the command.
   */
  public configure(): void {
    // Command configuration would go here
    // For example, defining arguments and options
  }

  /**
   * Executes the command
   *
   * This method must be implemented by subclasses to provide
   * command-specific functionality.
   *
   * @returns {Promise<number | void>} The exit code or void
   */
  public async execute(): Promise<number | void> {
    const subCommand = this.getArgument('command') || 'list'

    switch (subCommand) {
      case 'list':
        return this.listEvents()
      case 'process':
      // return this.processQueue(context.args[1])
      case 'clear':
      // return this.clearQueue(context.args[1])
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
      this.info('No events registered')
      return
    }

    this.info('Registered events:')

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
      const connection = this.queueManager.connection() as IQueueConnection

      if (!connection.process) {
        this.error('The current queue connection does not support processing')
        return
      }

      this.info(`Processing queue: ${queue || 'default'}`)
      await connection.process(queue)
      this.success('Queue processed successfully')
    } catch (error) {
      this.error(
        `Error processing queue: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Clear jobs in a queue.
   *
   * @param queue - The queue to clear
   */
  private async clearQueue(queue?: string): Promise<void> {
    try {
      const connection = this.queueManager.connection() as IQueueConnection

      if (!connection.clear) {
        this.error('The current queue connection does not support clearing')
        return
      }

      this.info(`Clearing queue: ${queue || 'default'}`)
      connection.clear(queue)
      this.success('Queue cleared successfully')
    } catch (error) {
      this.error(`Error clearing queue: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
