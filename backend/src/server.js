import express from "express";
import bodyParser from "body-parser";
import { PubSub } from "@google-cloud/pubsub";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(bodyParser.json());

const pubsub = new PubSub();
const TOPIC_NAME = process.env.ORDERS_TOPIC || "orders-created";

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", (req, res) => {
  // static mock for now
  res.json([
    { id: "p1", name: "Laptop Bag", price: 999 },
    { id: "p2", name: "Wireless Mouse", price: 499 },
    { id: "p3", name: "USB-C Hub", price: 1299 },
  ]);
});

app.post("/api/orders", async (req, res) => {
  const orderId = "ord_" + uuidv4();
  const order = {
    orderId,
    ...req.body,
    status: "RECEIVED",
    createdAt: new Date().toISOString(),
  };

  // TODO: optional – save to Firestore / Cloud SQL here

  // Publish to Pub/Sub
  try {
    const dataBuffer = Buffer.from(JSON.stringify(order));
    await pubsub.topic(TOPIC_NAME).publishMessage({ data: dataBuffer });

    res.status(201).json({
      orderId,
      status: "RECEIVED",
      message: "Order received and queued for processing",
    });
  } catch (err) {
    console.error("Error publishing message", err);
    res.status(500).json({ error: "Failed to publish order event" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Order API listening on port ${port}`);
});

