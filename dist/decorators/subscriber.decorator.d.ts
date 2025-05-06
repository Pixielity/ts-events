/**
 * Decorator that marks a class as an event subscriber.
 *
 * @returns {ClassDecorator} The decorator function
 *
 * @example
 * \`\`\`typescript
 * @Subscriber()
 * class UserEventSubscriber implements ISubscriber {
 *   subscribe(dispatcher: IEventDispatcher): void {
 *     dispatcher.listen(UserCreated.name, this.onUserCreated.bind(this));
 *     dispatcher.listen(UserDeleted.name, this.onUserDeleted.bind(this));
 *   }
 *
 *   onUserCreated(event: UserCreated): void {
 *     // Handle user created
 *   }
 *
 *   onUserDeleted(event: UserDeleted): void {
 *     // Handle user deleted
 *   }
 * }
 * \`\`\`
 */
declare function Subscriber(): ClassDecorator;

export { Subscriber };
