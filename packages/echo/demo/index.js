"use strict";
const { echo, sample, HEX_COLORS } = N3bulaEcho;
echo.__enable_trace = true;

async function cjsEcho(fn) {
    echo('--------------------- Running in CJS ---------------------');
    await fn(echo, sample, HEX_COLORS);
    echo('--------------------- Running in CJS ---------------------');
};