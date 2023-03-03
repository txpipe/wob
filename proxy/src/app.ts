

import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import express, { Express, Request, Response, NextFunction } from 'express';
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./routes";

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

// Register all routes from tsoa routes generation
RegisterRoutes(app);

// Handles errors
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {

  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  // TODO: Handle bad request or other error types
  next();
});

// Provides swagger docs
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// Handles not-found routes
app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});

// Starts the server
app.listen(port, () => {
  console.log("Server is running on port", port);
});

