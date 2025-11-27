import express from "express";

const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  // Pub/Sub push message format
  const message = req.body?.message;
  if (!message) {
    return res.status(400).send("No message");
  }

  const data = JSON.parse(Buffer.from(message.data, "base64").toString());
  console.log("Received order event:", data);

  // Fake notification
  console.log(
    `Sending email: "Your order ${data.orderId} for ₹${data.totalAmount} is being processed"`
  );

  res.status(204).send();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Notification service listening on port ${port}`);
});

