import type { Container } from "inversify"

/**
 * Base service provider class that all service providers must extend.
 * Service providers are responsible for binding services into the container
 * and bootstrapping any dependencies.
 *
 * @example
 * ```typescript
 * class CacheServiceProvider extends ServiceProvider {
 *   register(): void {
 *     this.app.singleton('cache', () => {
 *       return new CacheManager(this.app);
 *     });
 *   }
 *
 *   boot(): void {
 *     // Bootstrap the cache service
 *   }
 * }
 * ```
 */
export abstract class ServiceProvider {
  /**
   * The application instance.
   */
  protected app: Container

  /**
   * Create a new service provider instance.
   *
   * @param app - The application container instance
   */
  constructor(app: Container) {
    this.app = app
  }

  /**
   * Register any application services.
   * This method is called when the service provider is registered with the container.
   */
  abstract register(): void

  /**
   * Bootstrap any application services.
   * This method is called after all service providers have been registered.
   */
  boot?(): void
}
