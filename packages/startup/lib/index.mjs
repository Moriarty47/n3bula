import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import os from "node:os";
import path, { isAbsolute, normalize, resolve } from "node:path";
import url from "node:url";
import connect from "connect";
import fallback from "connect-history-api-fallback";
import open from "open";
import serveIndex from "serve-index";
import serveStatic from "serve-static";
import minimist from "minimist";
import debug from "debug";
import proxy from "http-proxy-middleware";
//#region src/argv.ts
const DEFAULT_PORT = 8e3;
const INDENT = "      ";
const argv = minimist(process.argv.slice(2), {
	alias: {
		cert: "c",
		fallback: "f",
		help: "h",
		key: "k",
		log: "l",
		name: "n",
		open: "o",
		port: "p",
		proxy: "x",
		root: "r"
	},
	boolean: ["log"],
	default: {
		port: DEFAULT_PORT,
		root: process.cwd()
	},
	string: [
		"port",
		"name",
		"open",
		"fallback"
	]
});
if (argv.help) {
	[
		"\x1B[32mUsage:\x1B[0m",
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
		`${INDENT}startup -x/--proxy [proxy_url] # Specified proxy url`
	].forEach((h) => {
		console.log(h.replace(/#(.*)$/, ($0) => `\x1b[90;3m${$0}\x1b[0m`));
	});
	process.exit(0);
}
if (argv.key && !argv.cert) {
	console.error("Missing cert file path/name, using [-c/--cert]");
	process.exit(1);
}
if (argv.cert && !argv.key) {
	console.error("Missing key file path/name, using [-k/--key]");
	process.exit(1);
}
//#endregion
//#region src/log.ts
debug.enable("startup");
const log = debug("startup");
//#endregion
//#region src/proxy.ts
var proxy_default = async (argv, app) => {
	if (argv.proxy) try {
		app.use(proxy.createProxyMiddleware({
			changeOrigin: true,
			target: new URL(argv.proxy)
		}));
	} catch (error) {
		await loadConfig(argv, app);
	}
};
async function loadConfig(argv, app) {
	let config = await import(path.resolve(argv.root, argv.proxy));
	try {
		config = config.devServer.proxy;
	} catch (error) {
		if (argv.log) log(error);
	}
	Object.values(config).forEach((ctx) => {
		app.use(proxy.createProxyMiddleware(ctx));
	});
}
//#endregion
//#region src/util.ts
function toAbsolutePath(input, baseDir) {
	if (typeof input !== "string" || input.trim() === "") {
		console.error("file path must be a non-empty string");
		process.exit(1);
	}
	if (isAbsolute(input)) return normalize(input);
	return normalize(resolve(baseDir, input));
}
function isFilenameOnly(input) {
	if (typeof input !== "string" || input.length === 0) return false;
	if (/^file:\/\//i.test(input)) return false;
	if (input.includes("/") || input.includes("\\")) return false;
	if (/^[a-zA-Z]:[\\/]/.test(input)) return false;
	if (/^\\\\[^\\]+\\/.test(input)) return false;
	return true;
}
//#endregion
//#region src/index.ts
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const openUrl = (url) => open(url, argv.open ? { app: { name: argv.open } } : void 0);
const getIPAddress = () => {
	const interfaces = os.networkInterfaces();
	const ipList = [];
	Object.values(interfaces).forEach((details) => {
		if (!details) return;
		details.forEach((detail) => {
			if (detail.internal || detail.family !== "IPv4") return;
			ipList.push(detail.address);
		});
	});
	ipList.sort((ip1) => ip1.indexOf("192") >= 0 ? -1 : 1);
	return ipList[0] || "127.0.0.1";
};
const app = connect();
app.use(async (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (argv.log) {
		if (req.url) {
			const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
			const physical = path.join(argv.root, decodeURIComponent(urlPath));
			log("REQ", req.method, req.url, "->", physical);
		}
		log(`${req.method} ${req.url}`);
	}
	next();
});
app.use(async (req, res, next) => {
	if (!req.url) return next();
	try {
		const url = new URL(req.url, `http://${req.headers.host}`);
		const ext = path.extname(url.pathname).toLowerCase();
		if (!([
			".mp4",
			".webm",
			".mp3",
			".m4a",
			".ogg"
		].includes(ext) && url.pathname.startsWith("/media/"))) return next();
		const filePath = path.join(argv.root, decodeURIComponent(url.pathname));
		await fsp.access(filePath, fs.constants.R_OK);
		const fileSize = (await fsp.stat(filePath)).size;
		const range = req.headers.range;
		const contentType = {
			".m4a": "audio/mp4",
			".mp3": "audio/mpeg",
			".mp4": "video/mp4",
			".ogg": "audio/ogg",
			".webm": "video/webm",
			".wmv": "video/x-ms-asf"
		}[ext] || "application/octet-stream";
		res.setHeader("Accept-Ranges", "bytes");
		if (range) {
			const matches = range.match(/bytes=(\d*)-(\d*)/);
			if (!matches) {
				res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
				return res.end();
			}
			const start = matches[1] === "" ? 0 : parseInt(matches[1], 10);
			const end = matches[2] === "" ? fileSize - 1 : Math.min(parseInt(matches[2], 10), fileSize - 1);
			if (start > end || start >= fileSize) {
				res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
				return res.end();
			}
			const chunkSize = end - start + 1;
			res.writeHead(206, {
				"Content-Length": String(chunkSize),
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Content-Type": contentType
			});
			const stream = fs.createReadStream(filePath, {
				end,
				start
			});
			stream.pipe(res);
			stream.on("error", () => {
				res.destroy();
			});
		} else {
			res.writeHead(200, {
				"Content-Length": String(fileSize),
				"Content-Type": contentType
			});
			const stream = fs.createReadStream(filePath);
			stream.pipe(res);
			stream.on("error", () => {
				res.destroy();
			});
		}
	} catch (err) {
		return next();
	}
});
if (argv.fallback !== void 0) {
	console.log("Enable html5 history mode.");
	app.use(fallback({ index: argv.fallback || "./index.html" }));
}
await proxy_default(argv, app);
app.use(serveStatic(argv.root, {
	extensions: ["html", "htm"],
	index: ["index.html"],
	setHeaders(res, filePath) {
		const ext = path.extname(filePath).toLowerCase();
		if (ext === ".html" || ext === ".htm") {
			res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			res.setHeader("Pragma", "no-cache");
			res.setHeader("Expires", "0");
		} else if ([".js", ".css"].includes(ext)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
		else if ([
			".png",
			".jpg",
			".jpeg",
			".webp",
			".svg",
			".gif"
		].includes(ext)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
		else res.setHeader("Cache-Control", "public, max-age=3600");
	}
}));
app.use(serveIndex(argv.root, { icons: true }));
const port = parseInt(argv._[0] || argv.port, 10);
const securePort = port + 1;
const hostname = argv.name || getIPAddress();
http.createServer(app).listen(port, () => {
	const url = `http://${hostname}${port !== 80 ? `:${port}` : ""}/`;
	console.log(`Running at ${url}`);
	if (argv.o === void 0) return;
	openUrl(url);
});
const { key, cert } = argv;
let keyName = "key.pem";
let certName = "cert.pem";
let usePath = false;
if (key && cert) if (isFilenameOnly(key) && isFilenameOnly(cert)) {
	keyName = key;
	certName = cert;
} else usePath = true;
const certOptions = usePath ? {
	cert: fs.readFileSync(toAbsolutePath(argv.cert, __dirname)),
	key: fs.readFileSync(toAbsolutePath(argv.key, __dirname))
} : {
	cert: fs.readFileSync(path.join(__dirname, "../certs", certName)),
	key: fs.readFileSync(path.join(__dirname, "../certs", keyName))
};
https.createServer(certOptions, app).listen(securePort, () => {
	const url = `https://${hostname}${securePort !== 80 ? `:${securePort}` : ""}/`;
	console.log(`Also running at ${url}`);
});
//#endregion
export {};
