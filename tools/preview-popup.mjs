import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedPort = Number(
  process.argv.find((argument) => argument.startsWith("--port="))?.split("=")[1]
);
const port = Number.isInteger(requestedPort) ? requestedPort : 4173;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  if (requestUrl.pathname === "/") {
    response.writeHead(302, { Location: "/preview/" }).end();
    return;
  }

  const pathname =
    requestUrl.pathname === "/preview/"
      ? "/preview/index.html"
      : requestUrl.pathname;
  const resolvedPath = path.resolve(root, `.${decodeURIComponent(pathname)}`);

  if (
    resolvedPath !== root &&
    !resolvedPath.startsWith(`${root}${path.sep}`)
  ) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(resolvedPath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type":
        mimeTypes[path.extname(resolvedPath)] || "application/octet-stream",
    });
    response.end(data);
  } catch {
    response.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Meta Checker preview: http://127.0.0.1:${port}/`);
  console.log("Press Ctrl+C to stop.");
});
