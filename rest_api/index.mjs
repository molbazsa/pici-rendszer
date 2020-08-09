import express from "express";
import cors from "cors";

import mongodb from "mongodb";
import {} from "./mongo_log.mjs";

import http from "http";
import https from "https";
import fs from "fs";

const HTTP_PORT = 1111;
const HTTPS_PORT = 1112;
const SSL_KEY = fs.readFileSync("credentials/ssl.key");
const SSL_CERT = fs.readFileSync("credentials/ssl.crt");
const CREDENTIALS = { key: SSL_KEY, cert: SSL_CERT };

const app = express();

app.use(express.json());
app.use(cors());

(async () => {
  // pass

  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP server listening on port ${HTTP_PORT}`);
  });

  https.createServer(CREDENTIALS, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
  });
})();
