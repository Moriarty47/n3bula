import { capitalize, getType, isArray, isBigInt, isBoolean, isFunction, isNull, isNumber, isPrimary, isString, isSymbol, padEnd, padStart, simpleMerge } from '@n3bula/utils';
const IS_CSS_LOADED = Symbol('is_CSS_Loaded');
const DOM_CACHE = new Map();
/** @public */
export const loadCSS = () => {
    if (window && window[IS_CSS_LOADED])
        return;
    const style = document.createElement('style');
    import('./json.css').then(value => {
        style.textContent = value.default;
        document.head.appendChild(style);
        Object.defineProperty(window, IS_CSS_LOADED, {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    });
};
export const render = (domID, content) => {
    let dom;
    if (typeof domID === 'string') {
        dom = DOM_CACHE.get(domID) || document.getElementById(domID);
        DOM_CACHE.set(domID, dom);
    }
    else {
        dom = domID;
    }
    if (dom) {
        const pre = document.createElement('pre');
        pre.classList.add('json-container');
        pre.innerHTML = content;
        dom.appendChild(pre);
    }
};
/** @public */
export const toHTML = (content, options = {}) => {
    const result = prettyJSONFormatter(content, Object.assign(Object.assign({}, options), { output: 'html' }));
    return {
        value: result,
        render(domID) {
            render(domID, result);
        }
    };
};
/** @public */
export const toText = (content, options = {}) => {
    const result = prettyJSONFormatter(content, Object.assign(Object.assign({}, options), { output: 'text' }));
    return {
        value: result,
        render(domID) {
            render(domID, result);
        }
    };
};
const defaults = {
    output: 'html',
    indent: 2,
    quoteKeys: false,
    singleQuote: true,
    oneLineArray: false,
    trailingComma: true,
};
/** @public */
export const prettyJSONFormatter = (content, options = {}) => {
    const config = simpleMerge(defaults, options);
    config.htmlMarks = presetMarks(config);
    if (isArray(content)) {
        if (config.oneLineArray) {
            if (hasArrayChildren(content)) {
                return flat2ArrayFormatter(content, config);
            }
            else {
                return flatArrayFormatter(content, config);
            }
        }
    }
    return mainFormatter(content, config);
};
loadCSS();
export default prettyJSONFormatter;
const presetMarks = (options) => {
    const isHTML = options.output === 'html';
    const typeMark = (value, type) => isHTML
        ? `<span class="json-${type}">${value}</span>`
        : `${value}`;
    const QUOTE = options.singleQuote
        ? typeMark('\'', 'mark')
        : typeMark('"', 'mark');
    const LT = isHTML ? '&lt;' : '<';
    const GT = isHTML ? '&gt;' : '>';
    const STRING = (value) => typeMark(`${QUOTE}${value}${QUOTE}`, 'string');
    const OBJECTKEY = options.quoteKeys
        ? STRING
        : (value) => typeMark(`${value}`, 'string');
    return {
        typeMark,
        TAB: '\t',
        QUOTE,
        SPACE: isHTML ? '&nbsp;' : ' ',
        LINEBREAK: '\n',
        SEMI: typeMark(': ', 'mark'),
        ARROW: typeMark(' => ', 'mark'),
        COMMA: typeMark(',', 'mark'),
        ARRAYLT: typeMark('[', 'array'),
        ARRAYRT: typeMark(']', 'array'),
        OBJECTLT: typeMark('{', 'object'),
        OBJECTRT: typeMark('}', 'object'),
        NULL: typeMark('null', 'null'),
        UNDEFINED: typeMark('undefined', 'undefined'),
        CIRCULAR_ERROR: typeMark(`${LT}Circular structure detected!${GT}`, 'error'),
        DATE: (value) => typeMark(value.toString(), 'mark'),
        ERROR: (value) => typeMark(value, 'error'),
        ITALIC: (value) => typeMark(value, 'italic'),
        STRING,
        NUMBER: (value) => typeMark(`${value}`, 'number'),
        SYMBOL: (value) => typeMark(value.toString(), 'symbol'),
        BIGINT: (value) => typeMark(`${value.toString()}n`, 'bigint'),
        BOOLEAN: (value) => typeMark(value ? 'true' : 'false', 'boolean'),
        FUNCTION: (value) => typeMark(value, 'function'),
        OBJECTKEY,
    };
};
function isPrimaryObject(input) {
    return ['string', 'number', 'boolean'].includes(getType(input));
}
function hasArrayChildren(arr) {
    return arr.some(ar => isArray(ar));
}
function findArrayMaxLength(arr) {
    const rowLen = arr.length;
    const colLen = arr[0].length;
    let maxLength = 0;
    for (let i = 0; i < rowLen; i += 1) {
        const row = arr[i];
        for (let j = 0; j < colLen; j += 1) {
            const ele = `${row[j]}`;
            if (ele.length > maxLength) {
                maxLength = ele.length;
            }
        }
    }
    return maxLength;
}
function flatArrayFormatter(input, options) {
    const { htmlMarks } = options;
    const rowLen = input.length;
    let str = '';
    str = `${htmlMarks.ARRAYLT} `;
    for (let i = 0; i < rowLen; i += 1) {
        const arrStr = mainFormatter(input[i], options);
        str += `${arrStr}${i < rowLen - 1 ? htmlMarks.COMMA : ''} `;
    }
    str += `${htmlMarks.ARRAYRT}`;
    return str;
}
function flat2ArrayFormatter(input, options) {
    const { htmlMarks, indent, output } = options;
    const rowLen = input.length;
    let str = '';
    if (output === 'html') {
        str = `${htmlMarks.ARRAYLT}${htmlMarks.LINEBREAK}`;
        const convert = (item) => {
            if (typeof item === 'string') {
                return htmlMarks.STRING(item);
            }
            return htmlMarks.NUMBER(item);
        };
        for (let i = 0; i < rowLen; i += 1) {
            const arrStr = isArray(input[i])
                ? `${htmlMarks.ARRAYLT} ${input[i].map(convert).join(', ')} ${htmlMarks.ARRAYRT}`
                : mainFormatter(input[i], options, 2);
            str += `${htmlMarks.SPACE.repeat(indent)}${arrStr}${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
        }
        str += `${htmlMarks.ARRAYRT}${htmlMarks.LINEBREAK}`;
    }
    else {
        const space = ' ';
        const gap = space.repeat(2);
        const colLen = input[0].length;
        const rowIdxLength = `${rowLen}`.length;
        const maxLength = findArrayMaxLength(input);
        str = `${padStart(space, rowIdxLength, space)}${gap}${Array.from({ length: colLen }, (_, i) => padEnd('' + i, maxLength, space)).join(gap)}${gap}${htmlMarks.LINEBREAK}`;
        for (let i = 0; i < rowLen; i += 1) {
            const arrStr = isArray(input[i])
                ? input[i].map(item => padEnd('' + item, maxLength, space)).join(gap)
                : mainFormatter(input[i], options);
            str += `${padStart('' + i, rowIdxLength, space)}${gap}${arrStr}${gap}${htmlMarks.LINEBREAK}`;
        }
    }
    return str;
}
function mainFormatter(input, options, level = 1, cacheMap = new WeakMap()) {
    const { htmlMarks } = options;
    if (isPrimary(input)) {
        return primaryFormatter(input, options);
    }
    if (isFunction(input)) {
        return functionFormatter(input, options);
    }
    if (isPrimaryObject(input)) {
        return primaryObjectFormatter(input, options);
    }
    const type = getType(input);
    if (type === 'date') {
        return htmlMarks.DATE(input);
    }
    if (type === 'error') {
        return errorFormatter(input, options);
    }
    if (type === 'object') {
        return objectFormatter(input, options, level, cacheMap);
    }
    if (type === 'array') {
        return arrayFormatter(input, options, level, cacheMap);
    }
    if (type === 'map') {
        return mapFormatter(input, options, level, cacheMap);
    }
    return '';
}
function mapFormatter(input, options, level, cacheMap) {
    const { htmlMarks, indent } = options;
    if (cacheMap.has(input)) {
        return htmlMarks.CIRCULAR_ERROR;
    }
    cacheMap.set(input, true);
    let str = `${htmlMarks.ITALIC('Map(' + input.size + ')')} ${htmlMarks.OBJECTLT}${htmlMarks.LINEBREAK}`;
    const entries = input.entries();
    let entry;
    while (entry = entries.next()) {
        if (entry.value) {
            const key = entry.value[0];
            const val = entry.value[1];
            str += `${htmlMarks.SPACE.repeat(indent * level)}${mainFormatter(key, options, level + 1, cacheMap)}${htmlMarks.ARROW}${mainFormatter(val, options, level + 1, cacheMap)}`;
        }
        if (entry.done) {
            break;
        }
        else {
            str += `${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
        }
    }
    str += `${htmlMarks.SPACE.repeat(indent * (level - 1))}${htmlMarks.OBJECTRT}`;
    return str;
}
function arrayFormatter(input, options, level, cacheMap) {
    const { htmlMarks, indent } = options;
    if (cacheMap.has(input)) {
        return htmlMarks.CIRCULAR_ERROR;
    }
    cacheMap.set(input, true);
    let str = `${htmlMarks.ARRAYLT}${htmlMarks.LINEBREAK}`;
    for (let i = 0, len = input.length; i < len; i += 1) {
        str += `${htmlMarks.SPACE.repeat(indent * level)}${mainFormatter(input[i], options, level + 1, cacheMap)}`;
        if (i < len - 1) {
            str += `${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
        }
        else {
            str += `${options.trailingComma ? htmlMarks.COMMA : ''}${htmlMarks.LINEBREAK}`;
        }
    }
    str += `${htmlMarks.SPACE.repeat(indent * (level - 1))}${htmlMarks.ARRAYRT}`;
    return str;
}
function objectFormatter(input, options, level, cacheMap) {
    const keys = Reflect.ownKeys(input);
    const { htmlMarks, indent } = options;
    if (cacheMap.has(input)) {
        return htmlMarks.CIRCULAR_ERROR;
    }
    cacheMap.set(input, true);
    let str = `${htmlMarks.OBJECTLT}${htmlMarks.LINEBREAK}`;
    for (let i = 0, len = keys.length; i < len; i += 1) {
        const key = typeof keys[i] === 'string'
            ? htmlMarks.OBJECTKEY(keys[i])
            : htmlMarks.SYMBOL(keys[i]);
        str += `${htmlMarks.SPACE.repeat(indent * level)}${key}${htmlMarks.SEMI}${mainFormatter(input[keys[i]], options, level + 1, cacheMap)}`;
        if (i < len - 1) {
            str += `${htmlMarks.COMMA}${htmlMarks.LINEBREAK}`;
        }
        else {
            str += `${options.trailingComma ? htmlMarks.COMMA : ''}${htmlMarks.LINEBREAK}`;
        }
    }
    str += `${htmlMarks.SPACE.repeat(indent * (level - 1))}${htmlMarks.OBJECTRT}`;
    return str;
}
function errorFormatter(input, options) {
    const { htmlMarks } = options;
    return input.stack
        ? input.stack.replace(new RegExp(`(${input.name}): (${input.message})`), (_, $1, $2) => `${htmlMarks.ERROR($1)}${htmlMarks.SEMI}${$2}`)
        : `${htmlMarks.ERROR(input.name)}${htmlMarks.SEMI}${input.message}`;
}
function primaryObjectFormatter(input, options) {
    const { htmlMarks } = options;
    const type = getType(input);
    const template = (t, val) => `${htmlMarks.ITALIC(capitalize(t))} ${htmlMarks.OBJECTLT} ${val} ${htmlMarks.OBJECTRT}`;
    if (type === 'number') {
        return template(type, htmlMarks.NUMBER(input));
    }
    else if (type === 'string') {
        return template(type, htmlMarks.STRING(input));
    }
    else if (type === 'boolean') {
        return template(type, htmlMarks.BOOLEAN(input));
    }
    return '';
}
function functionFormatter(input, options) {
    const { htmlMarks } = options;
    const funcStr = htmlMarks.typeMark(htmlMarks.ITALIC('ƒ '), 'function-identifier')
        + input.toString()
            .replace(/^(function )(\w+)\(/g, ($0, $1, $2) => `${$1}${htmlMarks.typeMark($2, 'function-name')}(`)
            .replace(/^function /, '')
            .replace(/(^function|=>)/, $0 => htmlMarks.typeMark($0, 'function-identifier'));
    return options.htmlMarks.FUNCTION(funcStr);
}
function primaryFormatter(input, options) {
    const { htmlMarks } = options;
    if (isString(input)) {
        return htmlMarks.STRING(input);
    }
    else if (isNumber(input)) {
        return htmlMarks.NUMBER(input);
    }
    else if (isBoolean(input)) {
        return htmlMarks.BOOLEAN(input);
    }
    else if (isBigInt(input)) {
        return htmlMarks.BIGINT(input);
    }
    else if (isSymbol(input)) {
        return htmlMarks.SYMBOL(input);
    }
    else if (isNull(input)) {
        return htmlMarks.NULL;
    }
    return htmlMarks.UNDEFINED;
}
//# sourceMappingURL=index.js.map