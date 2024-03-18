/** char code of forward slash '/' */
const CHAR_FORWARD_SLASH = 47;
/** char code of dot '.' */
const CHAR_DOT = 46;

// @ts-ignore
let process: NodeJS.Process;
// @ts-ignore
if (typeof process === 'undefined') {
  process = {
    cwd() { return '/'; }
  } as NodeJS.Process;
}

const charCodeAt = (str: string, index: number) =>
  String.prototype.charCodeAt.call(str, index);

const lastIndexOf = (str: string, searchString: string) =>
  String.prototype.lastIndexOf.call(str, searchString);

const slice = (str: string, start?: number, end?: number) =>
  String.prototype.slice.call(str, start, end);

const isCharDot = (code: number) => code === CHAR_DOT;

const isPosixPathSeparator = (code: number) => code === CHAR_FORWARD_SLASH;

function assertPath(path: string) {
  let pathType = typeof path;
  if (pathType !== 'string') {
    throw new TypeError(`Path must be a string. Received [${pathType}]`);
  }
}

/**
 * Resolve elements '.' and '..' in a path with directory names
 */
function normalizeStringPosix(path: string, allowAboveRoot: boolean) {
  let res = '';
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code = 0;

  for (let i = 0; i <= path.length; i++) {
    if (i < path.length) {
      code = charCodeAt(path, i);
    } else if (isPosixPathSeparator(code)) {
      break;
    } else {
      code = CHAR_FORWARD_SLASH;
    }

    if (isPosixPathSeparator(code)) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (dots === 2) {
        if ((res.length < 2) || lastSegmentLength !== 2 ||
          !isCharDot(charCodeAt(res, res.length - 1)) ||
          !isCharDot(charCodeAt(res, res.length - 2))
        ) {
          if (res.length > 2) {
            const lastSlashIndex = lastIndexOf(res, '/');
            if (lastSlashIndex === -1) {
              res = '';
              lastSegmentLength = 0;
            } else {
              res = slice(res, 0, lastSlashIndex);
              lastSegmentLength =
                res.length - 1 - lastIndexOf(res, '/');
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length !== 0) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }

        if (allowAboveRoot) {
          res += res.length > 0 ? `/..` : '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${slice(path, lastSlash + 1, i)}`;
        } else {
          res = slice(path, lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (isCharDot(code) && dots !== -1) {
      dots++;
    } else {
      dots = -1;
    }
  }

  return res;
}

type PathObject = Partial<{
  dir: string;
  ext: string;
  root: string;
  base: string,
  name: string;
}>;

function _format(sep: string, pathObject: PathObject = {}) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base ||
    `${pathObject.name || ''}${pathObject.ext || ''}`;

  if (!dir) return base;

  return dir === pathObject.root ? `${dir}${base}` : `${dir}${sep}${base}`;
}

export function resolve(...rest: string[]) {
  let resolvedPath = '';
  let resolvedAbsolute = false;

  for (let i = rest.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    const path = i >= 0 ? rest[i] : process.cwd();

    assertPath(path);

    if (path.length === 0) continue;

    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

  if (resolvedAbsolute) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : '.';
}

export function normalize(path: string) {
  assertPath(path);

  if (path.length === 0) return '.';

  const isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
  const trailingSeparator = isPosixPathSeparator(charCodeAt(path, path.length - 1));

  path = normalizeStringPosix(path, !isAbsolute);

  if (path.length === 0) {
    if (isAbsolute) return '/';
    return trailingSeparator ? './' : '.';
  }
  if (trailingSeparator) {
    path += '/';
  }

  return isAbsolute ? `/${path}` : path;
}

export function isAbsolute(path: string) {
  assertPath(path);
  return path.length > 0 && isPosixPathSeparator(charCodeAt(path, 0));
}

export function join(...rest: string[]) {
  if (rest.length === 0) return '.';

  let joined: string | undefined;
  for (let i = 0; i < rest.length; i++) {
    let arg = rest[i];
    assertPath(arg);
    if (arg.length > 0) {
      joined = joined === undefined ? arg : (joined += `/${arg}`);
    }
  }

  if (joined === undefined) return '.';
  return normalize(joined);
}

export function relative(from: string, to: string) {
  assertPath(from);
  assertPath(to);

  if (from === to) return '';

  // Trim leading forward slashes.
  from = resolve(from);
  to = resolve(to);

  if (from === to) return '';

  const fromStart = 1;
  const fromEnd = from.length;
  const fromLen = fromEnd - fromStart;
  const toStart = 1;
  const toLen = to.length - toStart;

  // Compare paths to find the longest common path from root
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i < length; i++) {
    const fromCode = charCodeAt(from, fromStart + i);
    if (fromCode !== charCodeAt(to, toStart + i)) {
      break;
    } else if (isPosixPathSeparator(fromCode)) {
      lastCommonSep = i;
    }
  }

  if (i === length) {
    if (toLen > length) {
      if (isPosixPathSeparator(charCodeAt(to, toStart + i))) {
        // We get here if `from` is the exact base path for `to`.
        // For example: from='/foo/bar'; to='/foo/bar/baz'
        return slice(to, toStart + i + 1);
      }
      if (i === 0) {
        // We get here if `from` is the root
        // For example: from='/'; to='/foo'
        return slice(to, toStart + i);
      }
    } else if (fromLen > length) {
      if (isPosixPathSeparator(charCodeAt(from, fromStart + i))) {
        // We get here if `to` is the exact base path for `from`.
        // For example: from='/foo/bar/baz'; to='/foo/bar'
        lastCommonSep = i;
      } else if (i === 0) {
        // We get here if `to` is the root.
        // For example: from='/foo/bar'; to='/'
        lastCommonSep = 0;
      }
    }
  }

  let out = '';
  // Generate the relative path based on the path difference between `to`
  // and `from`.
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; i++) {
    if (
      i === fromEnd ||
      isPosixPathSeparator(charCodeAt(from, i))
    ) {
      out += out.length === 0 ? '..' : '/..';
    }
  }

  // Lastly, append the rest of the destination (`to`) path that comes after
  // the common path parts.
  return `${out}${slice(to, toStart + lastCommonSep)}`;
};

export function toNamespacedPath(path: string) {
  // Non-op on posix systems
  return path;
};

export function dirname(path: string) {
  assertPath(path);

  if (path.length === 0) return '.';

  const hasRoot = isPosixPathSeparator(charCodeAt(path, 0));
  let end = -1;
  let matchedSlash = true;

  for (let i = path.length - 1; i >= 1; i--) {
    if (isPosixPathSeparator(charCodeAt(path, i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) return '//';
  return slice(path, 0, end);
};

export function basename(path: string, suffix?: string) {
  if (suffix !== undefined) {
    assertPath(suffix);
  }
  assertPath(path);

  let start = 0;
  let end = -1;
  let matchedSlash = true;

  if (suffix !== undefined && suffix.length > 0 && suffix.length <= path.length) {
    if (suffix === path) return '';
    let extIdx = suffix.length - 1;
    let firstNonSlashEnd = -1;
    for (let i = path.length - 1; i >= 0; i--) {
      const code = charCodeAt(path, i);
      if (isPosixPathSeparator(code)) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          // We saw the first non-path separator, remember this index in case
          // we need it if the extension ends up not matching
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          // Try to match the explicit extension
          if (code === charCodeAt(suffix, extIdx)) {
            if (--extIdx == -1) {
              // We matched the extension, so mark this as the end of our path
              // component
              end = i;
            }
          } else {
            // Extension does not match, so our result is the entire path
            // component
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }

    if (start === end) {
      end = firstNonSlashEnd;
    } else if (end === -1) {
      end = path.length;
    }
    return slice(path, start, end);
  }

  for (let i = path.length - 1; i >= 0; i--) {
    if (isPosixPathSeparator(charCodeAt(path, i))) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        start = i + 1;
        break;
      }
    } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return slice(path, start, end);
};

export function extname(path: string) {
  assertPath(path);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0;

  for (let i = path.length - 1; i >= 0; i--) {
    const code = charCodeAt(path, i);
    if (isPosixPathSeparator(code)) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }

    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }

    if (isCharDot(code)) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) {
        startDot = i;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (
    startDot === -1 ||
    end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    (
      preDotState === 1 &&
      startDot === end - 1 &&
      startDot === startPart + 1
    )
  ) {
    return '';
  }

  return slice(path, startDot, end);
};

export function format(pathObject?: PathObject) {
  if (pathObject === null || typeof pathObject !== 'object') {
    throw new TypeError(
      `Paramter "pathObject" must be an object, not ${typeof pathObject}`
    );
  }
  return _format('/', pathObject);
};


export function parse(path: string): PathObject {
  assertPath(path);

  const ret: PathObject = { ext: '', dir: '', root: '', base: '', name: '' };

  if (path.length === 0) return ret;

  const isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
  let start;

  if (isAbsolute) {
    ret.root = '/';
    start = 1;
  } else {
    start = 0;
  }

  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path.length - 1;

  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0;

  // Get non-dir info
  for (; i >= start; i--) {
    const code = charCodeAt(path, i);
    if (isPosixPathSeparator(code)) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }

    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }

    if (isCharDot(code)) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1) {
        startDot = i;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (end !== -1) {
    const start = startPart === 0 && isAbsolute ? 1 : startPart;
    if (
      startDot === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      (
        preDotState === 1 &&
        startDot === end - 1 &&
        startDot === startPart + 1
      )
    ) {
      ret.base = ret.name = slice(path, start, end);
    } else {
      ret.name = slice(path, start, startDot);
      ret.base = slice(path, start, end);
      ret.ext = slice(path, startDot, end);
    }
  }

  if (startPart > 0) {
    ret.dir = slice(path, 0, startPart - 1);
  } else if (isAbsolute) {
    ret.dir = '/';
  }

  return ret;
};

export const sep = '/';

export const delimiter = ':';

export const posix = null;

const path = {
  sep,
  delimiter,
  posix,
  join,
  parse,
  format,
  resolve,
  dirname,
  extname,
  basename,
  relative,
  normalize,
  isAbsolute,
  toNamespacedPath,
  // Legacy internal API, deprecated.
  _makeLong: toNamespacedPath,
};

export default path;