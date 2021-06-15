// Type definitions for sb-event-kit 3.0.0
// Project: https://github.com/steelbrain/event-kit
// Definitions by: Amin Yahyaabadi <https://github.com/aminya>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4

declare module "sb-event-kit" {
  /** A handle to a resource that can be disposed. */
  export class Disposable {
    /** A callback which will be called within dispose(). */
    callback?: () => void

    disposed: boolean

    /** Construct a Disposable. */
    constructor(disposableAction?: () => void)

    /** Perform the disposal action, indicating that the resource associated with this disposable is no longer needed. */
    dispose(): void
  }

  /**
   * An object that aggregates multiple Disposable instances together into a single disposable, so they can all be
   * disposed as a group.
   */
  export class CompositeDisposable {
    disposed: boolean

    /** Construct an instance, optionally with one or more disposables. */
    constructor(...disposables: Array<Disposable | Function | any>)

    /**
     * Dispose all disposables added to this composite disposable. If this object has already been disposed, this method
     * has no effect.
     */
    dispose(): void

    // Managing Disposables
    /**
     * Add disposables to be disposed when the composite is disposed. If this object has already been disposed, this
     * method has no effect.
     */
    add(...disposables: Array<Disposable | Function | any>): void

    /** Remove disposables */
    delete(disposable: Array<Disposable | Function | any>): void

    /** Clear all disposables. They will not be disposed by the next call to dispose. */
    clear(): void
  }

  /**
   * Utility class to be used when implementing event-based APIs that allows for handlers registered via ::on to be
   * invoked with calls to ::emit.
   */
  // tslint:disable-next-line:no-any
  export class Emitter<OptionalEmissions = { [key: string]: any }, RequiredEmissions = {}> {
    disposed: boolean
    handlers: Object

    /** Construct an emitter. */
    constructor()

    /** Clear out any existing subscribers. */
    clear(): void

    /** Unsubscribe all handlers. */
    dispose(): boolean

    // Event Subscription
    /** Registers a handler to be invoked whenever the given event is emitted. */
    on<T extends keyof OptionalEmissions>(eventName: T, handler: (value?: OptionalEmissions[T]) => void): Disposable
    /** Registers a handler to be invoked whenever the given event is emitted. */
    on<T extends keyof RequiredEmissions>(eventName: T, handler: (value: RequiredEmissions[T]) => void): Disposable

    off<T extends keyof OptionalEmissions>(eventName: T, handler: (value?: OptionalEmissions[T]) => void): void
    off<T extends keyof RequiredEmissions>(eventName: T, handler: (value: RequiredEmissions[T]) => void): void

    // Event Emission
    /** Invoke the handlers registered via ::on for the given event name. */
    emit<T extends keyof OptionalEmissions>(eventName: T, ...value: Array<OptionalEmissions[T]>): Promise<Array<any>>
    /** Invoke the handlers registered via ::on for the given event name. */
    emit<T extends keyof RequiredEmissions>(eventName: T, ...value: Array<RequiredEmissions[T]>): Promise<Array<any>>
  }
}
