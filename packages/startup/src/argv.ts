import minimist from 'minimist';

const DEFAULT_PORT = 8000;
const INDENT = '      ';

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
    key: 'k',
    cert: 'c',
  },
  string: ['port', 'name', 'open', 'fallback'],
  boolean: ['log'],
  default: {
    port: DEFAULT_PORT,
    root: process.cwd(),
  },
});

if (argv.help) {
  const helps = [
    '\x1b[32mUsage:\x1b[0m',
    `${INDENT}startup -h/--help # Show help information`,
    `${INDENT}startup # ${DEFAULT_PORT} as default port, current folder as root`,
    `${INDENT}startup [-p/--port] [port] # Running at specified port`,
    `${INDENT}startup -o/--open [browser=chrome,msedge,firefox,brave] # Open url with specified browser`,
    `${INDENT}startup -n/--name [hostname] # Running at specified hostname`,
    `${INDENT}startup -r/--root [root] # Specified root`,
    `${INDENT}startup -c/--cert [cert_path/name] # Specified cert path/name`,
    `${INDENT}startup -k/--key [key_path/name] # Specified key path/name`,
    `${INDENT}startup -l/--log # Show log info`,
    `${INDENT}startup -f/--fallback # Enable history fallback`,
    `${INDENT}startup -x/--proxy [proxy_url] # Specified proxy url`,
  ];
  helps.forEach(h => {
    console.log(h.replace(/#(.*)$/, $0 => `\x1b[90;3m${$0}\x1b[0m`));
  });
  process.exit(0);
}

if (argv.key && !argv.cert) {
  console.error('Missing cert file path/name, using [-c/--cert]');
  process.exit(1);
}
if (argv.cert && !argv.key) {
  console.error('Missing key file path/name, using [-k/--key]');
  process.exit(1);
}

export default argv;
