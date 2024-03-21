type CookieOptions = {
  path?: string;
  maxAge?: number;
  expires?: string | number | Date;
  [k: string]: string | number | boolean | Date | undefined;
};

type CookiesProps = {
  options?: CookieOptions,
  transformer?: {
    read: (value: string) => string,
    write: (value: string) => string,
  };
};

// /(?![ ;])([^=]+)=([^;]+)/g

export default function useCookies({ options, transformer }: CookiesProps = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  if (!window.navigator.cookieEnabled) {
    throw new Error('The browser does not support or is blocking cookies from being set.');
  }

  function read(value: string) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  }
  function write(value: string) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }

  transformer = Object.freeze({
    read,
    write,
    ...transformer,
  });

  const defaultOptions = Object.freeze({ path: '/', ...options });

  function set(name: string, value: string, options: CookieOptions = {}) {
    if (typeof document === 'undefined') return;

    options = { ...defaultOptions, ...options };

    if (typeof options.maxAge === 'number') {
      options.expires = new Date(Date.now() + options.maxAge * 1000);
    } else if (typeof options.expires === 'number') {
      options.expires = new Date(Date.now() + options.expires * 864e5);
    } else if (typeof options.expires === 'string') {
      options.expires = new Date(options.expires);
    }
    if (options.expires) {
      options.expires = (options.expires as Date).toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    let serializedString = '';
    for (const attr in options) {
      if (Object.prototype.hasOwnProperty.call(options, attr)) {
        if (!(options[attr])) continue;

        serializedString += `; ${attr}`;

        if (options[attr] === true) continue;

        serializedString += `=${(options[attr] as string).split(';')[0]}`;
      }
    }

    console.log(serializedString);

    return (document.cookie =
      `${name}=${transformer!.write(value)}${serializedString}`);
  }

  function getAll(cookies: string[], result: Record<string, Set<string> | Array<string>>) {
    for (let i = 0, len = cookies.length; i < len; i += 1) {
      const cookieParts = cookies[i].split('=');
      const value = cookieParts.slice(1).join('=');

      try {
        const key = decodeURIComponent(cookieParts[0]);
        if (!(key in result)) {
          result[key] = new Set();
        }
        (result[key] as Set<string>).add(transformer!.read(value));
      } catch { }
    }
  }

  function get(...names: string[]): Record<string, Array<string>> {
    if (typeof document === 'undefined') return {};

    const cookies = document.cookie ? document.cookie.split('; ') : [];

    const result: Record<string, Set<string> | Array<string>> = {};

    if (names.length === 0) {
      getAll(cookies, result);
    } else {
      for (let i = 0, len = cookies.length; i < len; i += 1) {
        const cookieParts = cookies[i].split('=');
        const value = cookieParts.slice(1).join('=');

        try {
          const key = decodeURIComponent(cookieParts[0]);
          if (!names.includes(key)) break;
          if (!(key in result)) {
            result[key] = new Set();
          }
          (result[key] as Set<string>).add(transformer!.read(value));
        } catch { }
      }
    }

    for (const key in result) {
      result[key] = Array.from(result[key] as Set<string>);
    }
    return result as Record<string, Array<string>>;
  }

  function has(name: string) {
    return !!get(name);
  }

  function size() {
    if (typeof document === 'undefined') return 0;

    const allCookies = get();
    let res = 0;
    for (const key in allCookies) {
      res += allCookies[key].length;
    }

    return res;
  }

  return {
    has,
    set,
    get,
    size,
    delete(name: string, attributes: CookieOptions) {
      set(name, '', { ...attributes, expires: -1 });
    },
  };
}
