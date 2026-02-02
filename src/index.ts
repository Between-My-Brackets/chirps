import express from "express";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";
import {adminGetMetrics, getMetrics, resetMetrics} from "./api/metrics.js";
import {middlewareMetricsInc} from "./middlewares/metrics.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc, express.static("src/app"));
app.use(middlewareLogResponses);

app.get("/api/healthz", healthReadiness);
app.get("/admin/metrics", adminGetMetrics);
app.get("/admin/reset", resetMetrics);
app.get("/api/metrics", getMetrics);
app.get("/api/reset", resetMetrics);

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
