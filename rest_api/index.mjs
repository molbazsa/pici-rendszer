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
    const csoportCollection = db.collection("csoport");

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
        const shouldAddGroup =
          (await csoportCollection.findOne({
            _id: req.body.id.slice(0, 3),
          })) === null;
        if (shouldAddGroup) {
          await csoportCollection.insertOne({
            _id: req.body.id.slice(0, 3),
            name: req.body.group,
            count: 1,
          });
        }
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

    app.post("/verify-item-id", async (req, res) => {
      console.log(`Item verification request: { id: "${req.body.id}" }`);
      res.json({
        available:
          (await termekCollection.findOne({
            _id: req.body.id,
          })) === null,
      });
    });

    app.post("/auto-item-id", async (req, res) => {
      let count = (
        await csoportCollection.findOne({
          _id: req.body.groupId,
        })
      ).count;
      let autoId = req.body.groupId + count.toString().padStart(6, "0");
      while (
        (await termekCollection.findOne({
          _id: autoId,
        })) !== null
      ) {
        count += 1;
        autoId = req.body.groupId + count.toString().padStart(6, "0");
        await csoportCollection.updateOne(
          { _id: req.body.groupId },
          { $inc: { count: 1 } }
        );
      }
      res.json({
        autoId: autoId,
      });
    });

    app.post("/new-group", async (req, res) => {
      console.log(`Adding group: (${req.body.id}) ${req.body.name}`);
      try {
        const dbres = await csoportCollection.insertOne({
          _id: req.body.id,
          name: req.body.name,
          count: 1,
        });
        console.log("Added group");
        res.json({
          msg: `Added group: (${req.body.id}) ${req.body.name}`,
          ok: 1,
          id: req.body.id,
          name: req.body.name,
          result: prettyInsert(dbres),
        });
      } catch (error) {
        console.error(error);
        res.json({
          msg: "Group cannot be added",
          ok: 0,
        });
      } finally {
        console.log("Response sent");
      }
    });

    app.post("/verify-group-id", async (req, res) => {
      console.log(`Group verification request: { id: "${req.body.id}" }`);
      res.json({
        available:
          (await csoportCollection.findOne({
            _id: req.body.id,
          })) === null,
      });
    });

    app.post("/verify-group-name", async (req, res) => {
      console.log(`Group verification request: { name: "${req.body.name}" }`);
      res.json({
        available:
          (await csoportCollection.findOne({
            name: req.body.name,
          })) === null,
      });
    });

    app.post("/get-group-name", async (req, res) => {
      console.log(`Sending group name for { id: "${req.body.id}" }`);
      res.json({
        name: (
          await csoportCollection.findOne({
            _id: req.body.id,
          })
        ).name,
      });
    });

    app.post("/group-name-search", (req, res) => {
      csoportCollection
        .find({
          // $text: { $search: new RegExp(req.body.searchTerm) },
          name: new RegExp(req.body.searchTerm, "i"),
        })
        .toArray((err, docs) => {
          if (err) {
            res.json({ msg: "error" });
            return;
          }
          res.json({
            documents: docs.sort((a, b) => {
              (a = a.name), (b = b.name);
              const atStart = (s) =>
                s.match(new RegExp(`^${req.body.searchTerm}`, "i")) !== null;
              if (atStart(a) && !atStart(b)) return -1;
              if (!atStart(a) && atStart(b)) return 1;
              return 0;
            }),
          });
        });
    });

    app.get("/auto-group-id", async (req, res) => {
      let count = (
        await csoportCollection.findOne({
          _id: "count",
        })
      ).count;
      let autoId = count.toString().padStart(3, "0");
      while (
        (await csoportCollection.findOne({
          _id: autoId,
        })) !== null
      ) {
        count += 1;
        autoId = count.toString().padStart(3, "0");
        await csoportCollection.updateOne(
          { _id: "count" },
          { $inc: { count: 1 } }
        );
      }
      res.json({
        req: req.url,
        autoId: autoId,
      });
    });

    app.get("/add-group-counter", async (req, res) => {
      await csoportCollection.insertOne({
        _id: "count",
        count: 1,
      });
      res.json({
        req: req.url,
        res: { ok: 1 },
      });
    });

    // app.get("/add-group-search-index", async (req, res) => {
    //   await csoportCollection.createIndex({ name: "text" });
    //   res.json({
    //     req: req.url,
    //     res: { ok: 1 },
    //   });
    // });

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
