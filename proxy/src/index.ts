import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import helmet from "helmet";
import { notFoundHandler, errorHandler } from "./api/middlewares";
import oneBoxRouter from "./routers/oneBoxRouter";

// @TODO: Move this to an env variable / config
const PORT = 8000;

const app: Application = express();

app.use(express.json());
app.use(helmet());

app.use("/", oneBoxRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
