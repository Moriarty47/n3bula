const theGlobal = typeof global === 'object'
    && global !== null
    && global.Object === Object
    && global;
const theGlobalThis = typeof globalThis === 'object'
    && globalThis !== null
    && globalThis.Object === Object
    && globalThis;
export default theGlobalThis || theGlobal || Function('return this')();
//# sourceMappingURL=root.js.map