import minimist from 'minimist';

const defaultPort = 8000;
const indent = '      ';
const argv = minimist(process.argv.slice(2), {
  alias: {
    open: 'o',
    port: 'p',
    name: 'n',
    help: 'h',
    root: 'r',
    proxy: 'x',
    log: 'l',
    fallback: 'f',
  },
  string: ['port', 'name', 'open', 'fallback'],
  boolean: ['log'],
  default: {
    port: defaultPort,
    root: process.cwd(),
  },
});

if (argv.help) {
  const helps = [
    '\x1b[32mUsage:\x1b[0m',
    `${indent}startup -h/--help # Show help information`,
    `${indent}startup # ${defaultPort} as default port, current folder as root`,
    `${indent}startup [-p/--port] [port] # Running at specified port`,
    `${indent}startup -o/--open [browser=chrome,msedge,firefox,brave] # Open url with specified browser`,
    `${indent}startup -n/--name [hostname] # Running at specified hostname`,
    `${indent}startup -r/--root [root] # Specified root`,
    `${indent}startup -l/--log # Show log info`,
    `${indent}startup -f/--fallback # Enable history fallback`,
    `${indent}startup -x/--proxy [proxy_url] # Specified proxy url`,
  ];
  helps.forEach(h => {
    console.log(h.replace(/#(.*)$/, $0 => `\x1b[90;3m${$0}\x1b[0m`));
  });
  process.exit(0);
}

export default argv;
