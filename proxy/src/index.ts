import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import helmet from "helmet";
import { notFoundHandler, errorHandler } from "./api/middlewares";
import blockfrostRouter from "./routers/blockfrostRouter";
import carpRouter from "./routers/carpRouter";
import ogmiosRouter from "./routers/ogmiosRouter";
import scrollsRouter from "./routers/scrollsRouter";

// @TODO: Move this to an env variable / config
const PORT = 8000;

const app: Application = express();

app.use(express.json());
app.use(helmet());

// @TODO: Revisit this and implement an easier to read method to know all routes.
app.use("/", blockfrostRouter);
app.use("/", scrollsRouter);
app.use("/", ogmiosRouter);
app.use("/", carpRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
