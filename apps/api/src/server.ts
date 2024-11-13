import express, { Request, Response, Application } from "express";
import { PORT as port } from "./config/envConfig";
import eoRouter from "./routes/eo.routes";
import ErrorMiddleware from "./middleware/error.middleware";

const PORT = Number(port) || 8000;

const app: Application = express();
app.use(express.json());

app.use("/eo", eoRouter);

// Testing API
// app.get("/api", (req: Request, res: Response) => {
//   res.status(200).send("Try ExpressJS");
// });

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
