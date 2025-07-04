import 'reflect-metadata'
import { injectable } from 'inversify'
import { SUBSCRIBERS_METADATA_KEY } from '../constants/metadata.constants'

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
export function Subscriber(): ClassDecorator {
  return (target: Function): any => {
    // Apply injectable decorator
    injectable()(target as any)

    // Store subscriber metadata
    Reflect.defineMetadata(
      SUBSCRIBERS_METADATA_KEY,
      {
        target,
      },
      target,
    )

    return target
  }
}
