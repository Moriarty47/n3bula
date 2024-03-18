/** char code of forward slash '/' */
var CHAR_FORWARD_SLASH = 47;
/** char code of dot '.' */
var CHAR_DOT = 46;
// @ts-ignore
var process;
// @ts-ignore
if (typeof process === 'undefined') {
    process = {
        cwd: function () { return '/'; }
    };
}
var charCodeAt = function (str, index) {
    return String.prototype.charCodeAt.call(str, index);
};
var lastIndexOf = function (str, searchString) {
    return String.prototype.lastIndexOf.call(str, searchString);
};
var slice = function (str, start, end) {
    return String.prototype.slice.call(str, start, end);
};
var isCharDot = function (code) { return code === CHAR_DOT; };
var isPosixPathSeparator = function (code) { return code === CHAR_FORWARD_SLASH; };
function assertPath(path) {
    var pathType = typeof path;
    if (pathType !== 'string') {
        throw new TypeError("Path must be a string. Received [".concat(pathType, "]"));
    }
}
/**
 * Resolve elements '.' and '..' in a path with directory names
 */
function normalizeStringPosix(path, allowAboveRoot) {
    var res = '';
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code = 0;
    for (var i = 0; i <= path.length; i++) {
        if (i < path.length) {
            code = charCodeAt(path, i);
        }
        else if (isPosixPathSeparator(code)) {
            break;
        }
        else {
            code = CHAR_FORWARD_SLASH;
        }
        if (isPosixPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {
                // NOOP
            }
            else if (dots === 2) {
                if ((res.length < 2) || lastSegmentLength !== 2 ||
                    !isCharDot(charCodeAt(res, res.length - 1)) ||
                    !isCharDot(charCodeAt(res, res.length - 2))) {
                    if (res.length > 2) {
                        var lastSlashIndex = lastIndexOf(res, '/');
                        if (lastSlashIndex === -1) {
                            res = '';
                            lastSegmentLength = 0;
                        }
                        else {
                            res = slice(res, 0, lastSlashIndex);
                            lastSegmentLength =
                                res.length - 1 - lastIndexOf(res, '/');
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                    else if (res.length !== 0) {
                        res = '';
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    res += res.length > 0 ? "/.." : '..';
                    lastSegmentLength = 2;
                }
            }
            else {
                if (res.length > 0) {
                    res += "/".concat(slice(path, lastSlash + 1, i));
                }
                else {
                    res = slice(path, lastSlash + 1, i);
                }
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        }
        else if (isCharDot(code) && dots !== -1) {
            dots++;
        }
        else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep, pathObject) {
    if (pathObject === void 0) { pathObject = {}; }
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base ||
        "".concat(pathObject.name || '').concat(pathObject.ext || '');
    if (!dir)
        return base;
    return dir === pathObject.root ? "".concat(dir).concat(base) : "".concat(dir).concat(sep).concat(base);
}
export function resolve() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    var resolvedPath = '';
    var resolvedAbsolute = false;
    for (var i = rest.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path_1 = i >= 0 ? rest[i] : process.cwd();
        assertPath(path_1);
        if (path_1.length === 0)
            continue;
        resolvedPath = "".concat(path_1, "/").concat(resolvedPath);
        resolvedAbsolute = isPosixPathSeparator(charCodeAt(path_1, 0));
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
        return "/".concat(resolvedPath);
    }
    return resolvedPath.length > 0 ? resolvedPath : '.';
}
export function normalize(path) {
    assertPath(path);
    if (path.length === 0)
        return '.';
    var isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
    var trailingSeparator = isPosixPathSeparator(charCodeAt(path, path.length - 1));
    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0) {
        if (isAbsolute)
            return '/';
        return trailingSeparator ? './' : '.';
    }
    if (trailingSeparator) {
        path += '/';
    }
    return isAbsolute ? "/".concat(path) : path;
}
export function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && isPosixPathSeparator(charCodeAt(path, 0));
}
export function join() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    if (rest.length === 0)
        return '.';
    var joined;
    for (var i = 0; i < rest.length; i++) {
        var arg = rest[i];
        assertPath(arg);
        if (arg.length > 0) {
            joined = joined === undefined ? arg : (joined += "/".concat(arg));
        }
    }
    if (joined === undefined)
        return '.';
    return normalize(joined);
}
export function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
        return '';
    // Trim leading forward slashes.
    from = resolve(from);
    to = resolve(to);
    if (from === to)
        return '';
    var fromStart = 1;
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;
    var toStart = 1;
    var toLen = to.length - toStart;
    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i < length; i++) {
        var fromCode = charCodeAt(from, fromStart + i);
        if (fromCode !== charCodeAt(to, toStart + i)) {
            break;
        }
        else if (isPosixPathSeparator(fromCode)) {
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
        }
        else if (fromLen > length) {
            if (isPosixPathSeparator(charCodeAt(from, fromStart + i))) {
                // We get here if `to` is the exact base path for `from`.
                // For example: from='/foo/bar/baz'; to='/foo/bar'
                lastCommonSep = i;
            }
            else if (i === 0) {
                // We get here if `to` is the root.
                // For example: from='/foo/bar'; to='/'
                lastCommonSep = 0;
            }
        }
    }
    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`.
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; i++) {
        if (i === fromEnd ||
            isPosixPathSeparator(charCodeAt(from, i))) {
            out += out.length === 0 ? '..' : '/..';
        }
    }
    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts.
    return "".concat(out).concat(slice(to, toStart + lastCommonSep));
}
;
export function toNamespacedPath(path) {
    // Non-op on posix systems
    return path;
}
;
export function dirname(path) {
    assertPath(path);
    if (path.length === 0)
        return '.';
    var hasRoot = isPosixPathSeparator(charCodeAt(path, 0));
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; i--) {
        if (isPosixPathSeparator(charCodeAt(path, i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        }
        else {
            // We saw the first non-path separator
            matchedSlash = false;
        }
    }
    if (end === -1)
        return hasRoot ? '/' : '.';
    if (hasRoot && end === 1)
        return '//';
    return slice(path, 0, end);
}
;
export function basename(path, suffix) {
    if (suffix !== undefined) {
        assertPath(suffix);
    }
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    if (suffix !== undefined && suffix.length > 0 && suffix.length <= path.length) {
        if (suffix === path)
            return '';
        var extIdx = suffix.length - 1;
        var firstNonSlashEnd = -1;
        for (var i = path.length - 1; i >= 0; i--) {
            var code = charCodeAt(path, i);
            if (isPosixPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else {
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
                    }
                    else {
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
        }
        else if (end === -1) {
            end = path.length;
        }
        return slice(path, start, end);
    }
    for (var i = path.length - 1; i >= 0; i--) {
        if (isPosixPathSeparator(charCodeAt(path, i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                start = i + 1;
                break;
            }
        }
        else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
        }
    }
    if (end === -1)
        return '';
    return slice(path, start, end);
}
;
export function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; i--) {
        var code = charCodeAt(path, i);
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
            }
            else if (preDotState !== 1) {
                preDotState = 1;
            }
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 &&
            startDot === end - 1 &&
            startDot === startPart + 1)) {
        return '';
    }
    return slice(path, startDot, end);
}
;
export function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
        throw new TypeError("Paramter \"pathObject\" must be an object, not ".concat(typeof pathObject));
    }
    return _format('/', pathObject);
}
;
export function parse(path) {
    assertPath(path);
    var ret = { ext: '', dir: '', root: '', base: '', name: '' };
    if (path.length === 0)
        return ret;
    var isAbsolute = isPosixPathSeparator(charCodeAt(path, 0));
    var start;
    if (isAbsolute) {
        ret.root = '/';
        start = 1;
    }
    else {
        start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    // Get non-dir info
    for (; i >= start; i--) {
        var code = charCodeAt(path, i);
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
            }
            else if (preDotState !== 1) {
                preDotState = 1;
            }
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (end !== -1) {
        var start_1 = startPart === 0 && isAbsolute ? 1 : startPart;
        if (startDot === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 &&
                startDot === end - 1 &&
                startDot === startPart + 1)) {
            ret.base = ret.name = slice(path, start_1, end);
        }
        else {
            ret.name = slice(path, start_1, startDot);
            ret.base = slice(path, start_1, end);
            ret.ext = slice(path, startDot, end);
        }
    }
    if (startPart > 0) {
        ret.dir = slice(path, 0, startPart - 1);
    }
    else if (isAbsolute) {
        ret.dir = '/';
    }
    return ret;
}
;
export var sep = '/';
export var delimiter = ':';
export var posix = null;
var path = {
    sep: sep,
    delimiter: delimiter,
    posix: posix,
    join: join,
    parse: parse,
    format: format,
    resolve: resolve,
    dirname: dirname,
    extname: extname,
    basename: basename,
    relative: relative,
    normalize: normalize,
    isAbsolute: isAbsolute,
    toNamespacedPath: toNamespacedPath,
    // Legacy internal API, deprecated.
    _makeLong: toNamespacedPath,
};
export default path;
