import express from "express";
import { middlewareLogResponses } from "./middlewares/logging.js";
import { middlewareMetricsInc } from "./middlewares/metrics.js";
import { errorHandler } from "./middlewares/errorHandling.js";

import adminRouter from './routes/admin.routes.js';
import apiRouter from './routes/api.routes.js'; // This will be the main router
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';


const app = express();
const PORT = 8080;

// Global Middleware
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("src/app"));

// OpenAPI / Swagger Docs
const openApiYaml = fs.readFileSync('./openapi.yaml', 'utf8');
const openApiDocument = yaml.load(openApiYaml) as Record<string, unknown>;
app.get('/api-docs.json', (req, res) => {
    res.json(openApiDocument);
});
app.get('/api-docs.yaml', (req, res) => {
    res.type('text/yaml').send(openApiYaml);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Routes
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// Error Handling
app.use(errorHandler);

// Start Server
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
