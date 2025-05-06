/**
 * Base Command
 *
 * Provides a base implementation for console commands.
 *
 * @module Console/Command
 */

import type { ICommand } from "./command.interface"
import { Output } from "../output/output"

/**
 * Abstract base class for console commands
 *
 * Provides common functionality for all commands.
 */
export abstract class BaseCommand implements ICommand {
  /**
   * The name of the command
   * @protected
   */
  protected name: string

  /**
   * The description of the command
   * @protected
   */
  protected description: string

  /**
   * The output instance
   * @protected
   */
  protected output: Output

  /**
   * Creates a new BaseCommand instance
   *
   * @param {string} name - The name of the command
   * @param {string} description - The description of the command
   */
  constructor(name: string, description = "") {
    this.name = name
    this.description = description
    this.output = new Output()
  }

  /**
   * Gets the name of the command
   *
   * @returns {string} The command name
   */
  public getName(): string {
    return this.name
  }

  /**
   * Gets the description of the command
   *
   * @returns {string} The command description
   */
  public getDescription(): string {
    return this.description
  }

  /**
   * Configures the command with options and arguments
   *
   * This method should be overridden by subclasses to define
   * command-specific options and arguments.
   */
  public configure(): void {
    // To be implemented by subclasses
  }

  /**
   * Executes the command
   *
   * This method must be implemented by subclasses to provide
   * command-specific functionality.
   *
   * @param {any} context - The execution context with arguments and options
   * @returns {Promise<number | void>} The exit code or void
   */
  public abstract execute(context: any): Promise<number | void>

  /**
   * Hook that runs before command execution
   *
   * @param {any} context - The execution context with arguments and options
   * @returns {Promise<boolean>} True if execution should continue, false to abort
   */
  public async beforeExecute(context: any): Promise<boolean> {
    return true
  }

  /**
   * Hook that runs after command execution
   *
   * @param {any} context - The execution context with arguments and options
   * @param {number | void} exitCode - The exit code from the command
   * @returns {Promise<void>}
   */
  public async afterExecute(context: any, exitCode: number | void): Promise<void> {
    // Default implementation does nothing
  }

  /**
   * Writes a line to the output
   *
   * @param {string} message - The message to write
   */
  protected line(message = ""): void {
    this.output.writeln(message)
  }

  /**
   * Writes an info message to the output
   *
   * @param {string} message - The message to write
   */
  protected info(message: string): void {
    this.output.info(message)
  }

  /**
   * Writes a success message to the output
   *
   * @param {string} message - The message to write
   */
  protected success(message: string): void {
    this.output.success(message)
  }

  /**
   * Writes an error message to the output
   *
   * @param {string} message - The message to write
   */
  protected error(message: string): void {
    this.output.error(message)
  }

  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The message to write
   */
  protected warning(message: string): void {
    this.output.warning(message)
  }

  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The message to write
   */
  protected comment(message: string): void {
    this.output.comment(message)
  }
}
