var theGlobal = typeof global === 'object'
    && global !== null
    && global.Object === Object
    && global;
var theGlobalThis = typeof globalThis === 'object'
    && globalThis !== null
    && globalThis.Object === Object
    && globalThis;
export default theGlobalThis || theGlobal || Function('return this')();
