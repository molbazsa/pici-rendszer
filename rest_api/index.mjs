import express from "express";
import cors from "cors";

import mongodb from "mongodb";
import { prettyInsert } from "./mongo_log.mjs";

import http from "http";
import https from "https";
import fs from "fs";

const URL = "mongodb://localhost:27017";
const OPTIONS = { useUnifiedTopology: true };
const DBNAME = "pici";

const HTTP_PORT = 1111;
const HTTPS_PORT = 1112;
const SSL_KEY = fs.readFileSync("credentials/ssl.key");
const SSL_CERT = fs.readFileSync("credentials/ssl.crt");
const CREDENTIALS = { key: SSL_KEY, cert: SSL_CERT };

const app = express();

app.use(express.json());
app.use(cors());

const mongo_client = new mongodb.MongoClient(URL, OPTIONS);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(CREDENTIALS, app);

(async () => {
  try {
    await mongo_client.connect();
    const db = mongo_client.db(DBNAME);

    const termekCollection = db.collection("termek");

    app.get("/", (req, res) => {
      res.json({
        name: "Pici System REST API server",
        url: req.url,
        ok: true,
      });
    });

    app.post("/new-item", async (req, res) => {
      console.log(`Adding item: (${req.body.id}) ${req.body.name}`);
      try {
        const dbres = await termekCollection.insertOne({
          _id: req.body.id,
          name: req.body.name,
        });
        console.log("Added item");
        res.json({
          msg: `Added item: (${req.body.id}) ${req.body.name}`,
          ok: 1,
          id: req.body.id,
          name: req.body.name,
          result: prettyInsert(dbres),
        });
      } catch (error) {
        console.error(error);
        res.json({
          msg: "Item cannot be added",
          ok: 0,
        });
      } finally {
        console.log("Response sent");
      }
    });

    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP server listening on port ${HTTP_PORT}`);
    });

    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();
