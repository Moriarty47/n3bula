# `@n3bula/startup`

### 

## Install

```sh
npm install @n3bula/startup
# or
yarn add @n3bula/startup
# or
pnpm add @n3bula/startup
```

## Use

## Usage

- startup -h/--help # Show help information
- startup # 8000 as default port, current folder as root
- startup [-p/--port] [port] # Running at specified port
- startup -o/--open [browser=chrome,msedge,firefox,brave] # Open url with specified browser
- startup -n/--name [hostname] # Running at specified hostname
- startup -r/--root [root] # Specified root
- startup -c/--cert [cert_path/name] # Specified cert path/name
- startup -k/--key [key_path/name] # Specified key path/name
- startup -l/--log # Show log info
- startup -f/--fallback # Enable history fallback
- startup -x/--proxy [proxy_url] # Specified proxy url

## Certs

Certs files saved in `[package_root]/certs`, replace with own certs files.

## Author

- [Moriarty47](https://github.com/Moriarty47)

## License

[The MIT License(MIT)](https://github.com/Moriarty47/n3bula/blob/main/LICENSE)
