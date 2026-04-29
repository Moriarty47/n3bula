"use strict";

window.umdEcho = async (fn) => {
    const { echo: umdE, sample: umdSample, HexColors: H, chalk: c } = N3bulaEcho;
    umdE.__enable_trace = false;
    console.log('N3bulaEcho :>>', N3bulaEcho);
    umdE.css(
        {
            background: 'linear-gradient(45deg, blue, red)',
            border: '3px solid #ddd',
            'border-radius': '8px',
            color: 'orange',
            'font-size': '20px',
            'font-weight': 'bolder',
            padding: '20px',
        },
    )('--------------------- Running in UMD ---------------------');
    await fn(umdE, umdSample, H, c);
    umdE.css(
        {
            background: 'linear-gradient(45deg, blue, red)',
            border: '3px solid #ddd',
            'border-radius': '8px',
            color: 'orange',
            'font-size': '20px',
            'font-weight': 'bolder',
            padding: '20px',
        },
    )('--------------------- Running in UMD ---------------------');
};