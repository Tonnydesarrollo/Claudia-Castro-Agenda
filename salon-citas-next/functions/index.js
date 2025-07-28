const functions = require("firebase-functions");
const next = require("next");

const dev = false;
const app = next({ dev, conf: { distDir: "../.next" } });
const handle = app.getRequestHandler();

exports.nextServer = functions
  .runWith({ memory: "1GB", timeoutSeconds: 60 })
  .https.onRequest(async (req, res) => {
    await app.prepare();
    return handle(req, res);
  });
