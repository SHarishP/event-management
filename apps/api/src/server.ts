import express, { Request, Response, Application } from "express";
import { BASE_WEB_URL, PORT as port } from "./config/envConfig";
import cors from "cors";
import ErrorMiddleware from "./middleware/error.middleware";
import eoRouter from "./routes/eo.routes";
import eventRouter from "./routes/event.routes";
import custRouter from "./routes/cust.routes";

const PORT = Number(port) || 8000;

const app: Application = express();

app.use(
  cors({ origin: BASE_WEB_URL || "http://localhost:3000", credentials: true })
);

app.use(express.json());

app.use("/eo", eoRouter);
app.use("/event", eventRouter);
app.use("/cust", custRouter);

// Testing API
// app.get("/api", (req: Request, res: Response) => {
//   res.status(200).send("Try ExpressJS");
// });

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
