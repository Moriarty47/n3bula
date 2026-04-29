"use strict";

window.cjsEcho = async (fn) => {
    // const { echo, sample, HEX_COLORS } = N3bulaEcho;
    echo.__enable_trace = false;
    echo.css(
        {
            background: 'linear-gradient(45deg, green, blue)',
            border: '3px solid #ddd',
            'border-radius': '8px',
            color: 'orange',
            'font-size': '20px',
            'font-weight': 'bolder',
            padding: '20px',
        },
    )('--------------------- Running in CJS ---------------------');
    await fn(echo, sample, HexColors, chalk);
    echo.css(
        {
            background: 'linear-gradient(45deg, green, blue)',
            border: '3px solid #ddd',
            'border-radius': '8px',
            color: 'orange',
            'font-size': '20px',
            'font-weight': 'bolder',
            padding: '20px',
        },
    )('--------------------- Running in CJS ---------------------');
};