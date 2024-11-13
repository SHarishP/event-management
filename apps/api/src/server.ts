import express, { Request, Response, Application } from "express";

import { PORT as port } from "./config/envConfig";

const PORT = Number(port) || 8000;

const app: Application = express();

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Try ExpressJS");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
