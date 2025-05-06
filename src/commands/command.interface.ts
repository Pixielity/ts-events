/**
 * Interface for console commands
 */
export interface ICommand {
  /**
   * Gets the name of the command
   *
   * @returns {string} The command name
   */
  getName(): string

  /**
   * Gets the description of the command
   *
   * @returns {string} The command description
   */
  getDescription(): string

  /**
   * Configures the command with options and arguments
   */
  configure(): void

  /**
   * Executes the command
   *
   * @param {any} context - The execution context with arguments and options
   * @returns {Promise<number | void>} The exit code or void
   */
  execute(context: any): Promise<number | void>

  /**
   * Hook that runs before command execution
   *
   * @param {any} context - The execution context with arguments and options
   * @returns {Promise<boolean>} True if execution should continue, false to abort
   */
  beforeExecute(context: any): Promise<boolean>

  /**
   * Hook that runs after command execution
   *
   * @param {any} context - The execution context with arguments and options
   * @param {number | void} exitCode - The exit code from the command
   * @returns {Promise<void>}
   */
  afterExecute(context: any, exitCode: number | void): Promise<void>
}

/**
 * DI token for ICommand interface
 */
export namespace ICommand {
  export const $ = Symbol.for("ICommand")
}
