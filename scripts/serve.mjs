import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const preferredPort = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requestPath = decoded === "/" ? "/index.html" : decoded;
  const filePath = normalize(join(root, requestPath));
  return filePath.startsWith(root) ? filePath : join(root, "index.html");
}

function listen(port) {
  const server = createServer(async (req, res) => {
    const filePath = safePath(req.url || "/");
    const finalPath = existsSync(filePath) ? filePath : join(root, "index.html");
    const ext = extname(finalPath);
    res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");

    try {
      if (req.method === "HEAD") {
        res.statusCode = 200;
        res.end();
        return;
      }

      createReadStream(finalPath)
        .on("error", async () => {
          res.statusCode = 404;
          res.end(await readFile(join(root, "index.html"), "utf8"));
        })
        .pipe(res);
    } catch (error) {
      res.statusCode = 500;
      res.end(`Local server error: ${error.message}`);
    }
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < preferredPort + 20) {
      listen(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Moxie Routine Coach + Review Radar running at http://127.0.0.1:${port}`);
  });
}

listen(preferredPort);
