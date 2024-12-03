import express, { Request, Response, Application, NextFunction } from "express";
import { BASE_WEB_URL, PORT as port } from "./config/envConfig";
import cors from "cors";
import ErrorMiddleware from "./middlewares/error.middleware";
import eventRouter from "./routes/event.routes";
import userRouter from "./routes/user.routes";
import transactionRouter from "./routes/transaction.routes";
import path from "path";

const PORT = Number(port) || 8000;

const app: Application = express();

app.use(
  cors({ origin: BASE_WEB_URL || "http://localhost:3000", credentials: true })
);

app.use(`/public`, express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.use("/event", eventRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

// Testing API
// app.get("/api", (req: Request, res: Response) => {
//   res.status(200).send("Try ExpressJS");
// });

app.use(ErrorMiddleware);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({ message: err.message || "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // DONT FORGET TO DELETE THIS!
  console.log("Serving files from:", path.join(__dirname, "../public"));
});
