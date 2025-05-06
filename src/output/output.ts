/**
 * Output class for console output
 */
export class Output {
  /**
   * Write a message to the output
   *
   * @param message - The message to write
   */
  public write(message: string): void {
    process.stdout.write(message)
  }

  /**
   * Write a message to the output with a newline
   *
   * @param message - The message to write
   */
  public writeln(message = ""): void {
    process.stdout.write(`${message}\n`)
  }

  /**
   * Write an info message to the output
   *
   * @param message - The message to write
   */
  public info(message: string): void {
    this.writeln(`\x1b[36mINFO\x1b[0m: ${message}`)
  }

  /**
   * Write a success message to the output
   *
   * @param message - The message to write
   */
  public success(message: string): void {
    this.writeln(`\x1b[32mSUCCESS\x1b[0m: ${message}`)
  }

  /**
   * Write an error message to the output
   *
   * @param message - The message to write
   */
  public error(message: string): void {
    this.writeln(`\x1b[31mERROR\x1b[0m: ${message}`)
  }

  /**
   * Write a warning message to the output
   *
   * @param message - The message to write
   */
  public warning(message: string): void {
    this.writeln(`\x1b[33mWARNING\x1b[0m: ${message}`)
  }

  /**
   * Write a comment message to the output
   *
   * @param message - The message to write
   */
  public comment(message: string): void {
    this.writeln(`\x1b[90mCOMMENT\x1b[0m: ${message}`)
  }
}
