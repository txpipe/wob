import * as dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import express, { Express, Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { buildProviderModule } from 'inversify-binding-decorators';
import { RegisterRoutes } from './routes';
import { iocContainer } from './ioc';
import { BadRequestError } from './api/errors';

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

// Register all routes from tsoa routes generation
RegisterRoutes(app);

// Handles errors
app.use(function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
        });
    }
    if (err instanceof BadRequestError) {
        return res.status(400).json({
            message: err.message || 'unknown error',
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
    // @TODO: Handle bad request or other error types so not everything falls under
    // internal server error
    next();
});

// Provides swagger docs
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json',
        },
    }),
);

// Handles not-found routes
app.use(function notFoundHandler(_req, res: Response) {
    res.status(404).send({
        message: 'Not Found',
    });
});

// Dependency injection container is loaded after all decorators are executed.
iocContainer.load(buildProviderModule());

// Starts the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});
