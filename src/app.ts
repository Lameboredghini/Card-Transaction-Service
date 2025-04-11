import express from "express";
import { json, urlencoded } from "express";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message:
      "Service is up and running!!!!!! Grab your coffee and start coding :)",
  });
});

export default app;
