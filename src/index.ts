import express from "express";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";
import {getMetrics, resetMetrics} from "./api/metrics.js";
import {middlewareMetricsInc} from "./middlewares/metrics.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc, express.static("src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", healthReadiness);
app.get("/metrics", getMetrics);
app.get("/reset", resetMetrics);

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
