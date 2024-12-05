/* eslint-disable no-console */
/// <reference lib="dom" />

export type {};

(() => {
  const TAG = '[@n3bula/next-sw] ';

  const unsupported = (reason: string): Error => {
    console.error(`${TAG}Live reloading is unsupported`);
    return new TypeError(reason);
  };

  const URLPortDescriptor = Object.getOwnPropertyDescriptor(URL.prototype, 'port');

  if (
    typeof URLPortDescriptor === 'undefined' ||
    (URLPortDescriptor.writable !== true &&
      typeof URLPortDescriptor.set !== 'function')
  ) {
    throw unsupported('URL.prototype.port is not writable');
  }

  // Original ServiceWorkerContainer
  const sw = typeof navigator !== 'undefined' &&
    typeof navigator.serviceWorker !== 'undefined' &&
    typeof navigator.serviceWorker.register === 'function' ?
    navigator.serviceWorker :
      {
        register: () => Promise.reject(unsupported('ServiceWorkerContainer is invalid')),
      } as unknown as ServiceWorkerContainer;

  if ('next-sw' in sw) return;

  Object.defineProperty(sw, 'next-sw', { value: true });

  // Preserve original register
  const register = sw.register;

  // Preserve own registrations
  const registrations: ServiceWorkerRegistration[] = [];

  // Unregister all workers
  const unregister = () => Promise.all(registrations.map(registration =>
    registration
      .unregister()
      .catch((error: unknown) => {
        console.error(`${TAG}Unregistration failed: `, error);
        return false;
      })));

  // Save registrations
  const proxyRegister = (...args: any) =>
    register
      .apply(sw, args)
      .then((registration) => {
        registrations.push(registration);
        return registration;
      });

  // Patch register
  Object.defineProperty(sw, 'register', {
    enumerable: true,
    value: proxyRegister,
  });

  // Live reloading endpoint
  const url = new URL('/', location.origin);

  // Live reloading port
  url.port = process.env.__NEXT_SW_PORT || '3001';

  // Live reloading
  const source = new EventSource(url);

  source.addEventListener('next-sw:wait', () => {
    console.warn(`${TAG}Compilation errors detected, reload prevented...`);
  });

  source.addEventListener('next-sw:reload', () => {
    console.info(`${TAG}Update detected, reloading...`);

    unregister()
      .then(() => location.reload(), () => location.reload());
  });

  source.addEventListener('error', () => {
    if (source.readyState !== source.CLOSED) {
      try {
        source.close();
      } catch (error: unknown) {
        console.error(error);
      }
    }

    console.error(`${TAG}Server has disconnected`);
  });
})();
