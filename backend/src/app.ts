import express from "express";
import { middlewareLogResponses } from "./middlewares/logging.js";
import { middlewareMetricsInc } from "./middlewares/metrics.js";
import { errorHandler } from "./middlewares/errorHandling.js";
import adminRouter from "./routes/admin.routes.js";
import apiRouter from "./routes/api.routes.js";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Global Middleware
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("src/app"));

// OpenAPI / Swagger Docs
const openApiPath = path.resolve(__dirname, "..", "openapi.yaml");
const openApiYaml = fs.readFileSync(openApiPath, "utf8");
const openApiDocument = yaml.load(openApiYaml) as Record<string, unknown>;
app.get("/api-docs.json", (_req, res) => {
    res.json(openApiDocument);
});
app.get("/api-docs.yaml", (_req, res) => {
    res.type("text/yaml").send(openApiYaml);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Routes
app.use("/admin", adminRouter);
app.use("/api", apiRouter);

// Error Handling
app.use(errorHandler);
