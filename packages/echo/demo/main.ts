// import { echo } from '../src';
import { echo } from '../dist';

function test2() {
  echo.log
    .v('test')
    .css({
      'font-family': '霞鹜文楷等宽',
      'font-size': '50px',
      color: 'white',
    })
    .p([1, 2, 3]);
}

test2();

function test1() {
  echo.log
    // .v(' ').img('./images/1.jpg')
    // .v('\n')
    .v('Hello World!\n').fg.black
    .v('Hello World!\n').fg.red
    .v('Hello World!\n').fg.green
    .v('Hello World!\n').fg.yellow
    .v('Hello World!\n').fg.blue
    .v('Hello World!\n').fg.magenta
    .v('Hello World!\n').fg.cyan
    .v('Hello World!\n').fg.white
    .v('Hello World!\n').fg.gray
    .v('Hello World!\n').fg('#ffccff')
    .v('Hello World!\n').bg.black
    .v('Hello World!\n').bg.red
    .v('Hello World!\n').bg.green
    .v('Hello World!\n').bg.yellow
    .v('Hello World!\n').bg.blue
    .v('Hello World!\n').bg.magenta
    .v('Hello World!\n').bg.cyan
    .v('Hello World!\n').bg.white
    .v('Hello World!\n').bg.gray
    .v('Hello World!\n').bg('#ffccff')
    .v('你好，世界！').css({
      'font-family': '霞鹜文楷等宽',
      'font-size': '50px',
      color: 'white',
      'text-shadow': '3px 0 3px #F10D58,7px 0 7px #4578D5',
      display: 'inline-block',
      border: '3px solid red',
      'border-radius': '7px',
      padding: '10px',
      margin: '20px',
    })
    .v('\nRAINBOW\n').css({
      'font-size': '50px',
      color: '#ff0000',
      'text-shadow': '0 2px 2px #FF0000,-2px 5px 0 #ff7f00, -4px 10px 0 #ffff00,-8px 15px 0 #00ff00,-12px 20px 0 #0000ff,-16px 25px 0 #4b0082,-20px 30px 0 #9400d3',
    })
    .v('N3BULA\n').css({
      'font-size': '50px',
      color: 'white',
      'text-shadow': '0 0 4px #fff,0 0 11px #fff,0 0 19px #fff,0 0 40px #f09,0 0 80px #f09,0 0 90px #f09,0 0 100px #f09,0 0 150px #f09',
    })
    .v('Unicode6.1   😀😗😙😑😮😯😴😛😕😟\n')
    .v('Unicode7.0   🙂🙁🕵🗣🕴🖕🖖🖐\n')
    .v('Unicode8.0   🤗🤓🤔🙄🤐🙃🤑🤒🤕🤖\n')
    .v('Unicode9.0   🤣🤠🤡🤥🤤🤢🤧🤴🤶🤵🤷\n')
    .v('Unicode10.0  🤩🤨🤯🤪🤬🤮🤫🤭🧐🧒\n')
    .v('Unicode11.0  🥰🥵🥶🥴🥳🥺🦵🦶🦷🦴🦸🦹\n')
    .v('Unicode12.0  🥱🤎🤍🤏🦾🦿🦻🧏🧍🧎🦧🦮\n')
    .v('Unicode13.0  🥲🥸🤌🫀🫁🥷🫂🦬🦣🦫🦤🪶🦭🪲🪳\n')
    .v('Unicode14.0  🫠🫢🫣🫡🫥🫤🥹🫱🫲🫳🫴🫰🫵\n')
    .v('Unicode15.0  🫨🩷🩵🩶🫷🫸🫎🫏🪽🪿🪼🪻\n')
    .v('Moriarty\n').css({
      'font-size': '100px',
      'font-family': 'HGHT1_CNKI',
      color: 'white',
      'text-shadow': '0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #5271ff,0 0 82px #5271ff,0 0 92px #5271ff,0 0 102px #5271ff,0 0 151px #5271ff',
    })
    .p();
}

test1();