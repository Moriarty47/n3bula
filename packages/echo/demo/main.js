document.addEventListener('DOMContentLoaded', init);

const onClick = e => {
  console.clear();
  window[`${e.target.id}Echo`]?.(async (echo, sample, HEX_COLORS) => {
    echo.css(
      {
        background: 'linear-gradient(45deg, blue, red)',
        border: '3px solid #ddd',
        'border-radius': '8px',
        color: 'orange',
        'font-size': '20px',
        'font-weight': 'bolder',
        padding: '20px',
      },
      null,
      {
        background: 'linear-gradient(45deg, red, blue)',
        border: '3px solid #ddd',
        'border-radius': '8px',
        color: 'orange',
        'font-size': '20px',
        'font-weight': 'bolder',
        padding: '20px',
      },
    )(echo.__TAG, echo.SPACE(30), echo.__TAG.split('').reverse().join(''));
    var colors = (0, sample)(Object.keys(HEX_COLORS), 10);
    for (var i = 0, len = colors.length; i < len; i += 2) {
      var j = colors[i];
      var k = colors[i + 1];
      echo.fg(j, '').bg('', k)('Hello', 'World!');
    }
    (0, echo)('Hello World!');
    echo.fg.cadetBlue('Hello World!');
    echo.fg('#1ff', 'black').bg('red', 'white')('Hello', {}, ['xxx'], 'World!');
    echo.fg('purple', 'rgb(255,0,0)')('Hello World!');
    echo.fg.magenta('Hello', {}, 'World!');
    echo.bg.darkOrange('Hello', [], 'World!');
    echo.fg('', 'hsl(350, 40, 50)').bg('', 'rgb(120, 120, 120)')(
      'Hello',
      {},
      'World!',
    );
    echo.css.underline.dotted.fg.lightGreen('Dotted');
    echo.css(null, {
      'text-decoration': 'underline wavy',
    })('This is a', 'Wavy', 'text decoration.');
    await echo.trace.css(
      {
        color: 'red',
        'text-decoration': 'underline wavy',
      },
      {
        border: '2px solid #fcf',
        'border-radius': '8px',
        // url: 'data:imag' as const,
        height: '100px',
        url: './1.jpg',
      },
      {
        color: 'cyan',
      },
      {
        color: 'orange',
      },
    )(echo.__TAG, ' ', 'Hello', 'World!');
    echo('😀😗😙😑😮😯😴😛😕😟\n');
    echo('🙂🙁🕵🗣🕴🖕🖖🖐\n');
    echo('🤗🤓🤔🙄🤐🙃🤑🤒🤕🤖\n');
    echo('🤣🤠🤡🤥🤤🤢🤧🤴🤶🤵🤷\n');
    echo('🤩🤨🤯🤪🤬🤮🤫🤭🧐🧒\n');
    echo('🥰🥵🥶🥴🥳🥺🦵🦶🦷🦴🦸🦹\n');
    echo('🥱🤎🤍🤏🦾🦿🦻🧏🧍🧎🦧🦮\n');
    echo('\u{2764}\u{FE0F}\u{200D}\u{1F525}');
    echo.log('Hello World!');
    echo.log.fg.magenta.bg.green('Hello World!');
    echo.info('Hello World!');
    echo.warn('Hello World!');
    // echo.warn.info('Hello World!');
    echo.error('Hello World!');
    echo.css({
      color: 'white',
      'font-family': 'HGHT1_CNKI',
      'font-size': '100px',
      'text-shadow':
        '0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #5271ff,0 0 82px #5271ff,0 0 92px #5271ff,0 0 102px #5271ff,0 0 151px #5271ff',
    })('Moriarty');
    echo.css({
      border: '3px solid red',
      'border-radius': '7px',
      color: 'white',
      display: 'inline-block',
      'font-family': '霞鹜文楷等宽',
      'font-size': '50px',
      margin: '20px',
      padding: '10px',
      'text-shadow': '3px 0 3px #F10D58,7px 0 7px #4578D5',
    })('你好，世界！');
    echo.css({
      color: '#ff0000',
      'font-size': '50px',
      'text-shadow':
        '0 2px 2px #FF0000,-2px 5px 0 #ff7f00, -4px 10px 0 #ffff00,-8px 15px 0 #00ff00,-12px 20px 0 #0000ff,-16px 25px 0 #4b0082,-20px 30px 0 #9400d3',
    })('RAINBOW');
    echo.css({
      color: 'white',
      'font-size': '50px',
      'text-shadow':
        '0 0 4px #fff,0 0 11px #fff,0 0 19px #fff,0 0 40px #f09,0 0 80px #f09,0 0 90px #f09,0 0 100px #f09,0 0 150px #f09',
    })('N3BULA');
  });
};
function init() {
  document.getElementById('esm').addEventListener('click', onClick);
  document.getElementById('cjs').addEventListener('click', onClick);
}
