type EventListener = ((...rest: any[]) => void) & {
  [ONCE]?: boolean;
};

const create = Object.create;
const apply = Function.prototype.apply;
const defProp = Object.defineProperty;
const descriptor: PropertyDescriptor = {
  configurable: false,
  enumerable: false,
  writable: true,
};

const ONCE = Symbol('__ONCE__');
let __ee_id = 0;

export class EventEmitter {
  private events: Record<string, EventListener[]>;

  constructor(name?: string) {
    defProp(this, '__ee_id', {
      value: name || __ee_id++,
      writable: false,
      ...descriptor,
    });
    this.events = create(null);
  }

  @ThrowExceptions()
  on(type: string, listener: EventListener, once = false) {
    this.events[type] = this.events[type] || [];
    if (this.events[type].indexOf(listener) === -1) {
      if (once) {
        defProp(listener, ONCE, { ...descriptor, value: true });
      }
      this.events[type].push(listener);
    }
    return this;
  }

  @ThrowExceptions()
  once(type: string, listener: EventListener) {
    this.on(type, listener, true);
    return this;
  }

  @ThrowExceptions()
  off(type: string, listener: EventListener) {
    const listeners = this.events[type];

    if (!listeners) return this;

    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
    return this;
  }

  @ThrowExceptions()
  emit(type: string, ...rest: any[]) {
    const listeners = this.events[type];

    if (!listeners) return this;

    const array = listeners.slice(0);
    for (let i = 0; i < array.length; i += 1) {
      apply.call(array[i], this, rest);
      if (array[i][ONCE]) {
        this.off(type, listeners[i]);
      }
    }
  }

  @ThrowExceptions()
  hasListeners(type?: string) {
    if (type) {
      return !!(this.events[type]?.length);
    }
    return !!(Object.keys(this.events).length);
  }

  @ThrowExceptions()
  offAll() {
    this.events = create(null);
  }
};

export function useEventEmitter(name?: string) {
  return new EventEmitter(name);
};

function ThrowExceptions(): MethodDecorator {
  return function (_target, _propKey, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...rest: any[]) {
      try {
        return originalMethod.apply(this, rest);
      } catch (error) {
        throw new Error(error as string);
      }
    };
  };
};

export default EventEmitter;
