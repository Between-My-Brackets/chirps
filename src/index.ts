import express from "express";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";
import {adminGetMetrics, adminResetMetrics, getMetrics, resetMetrics} from "./api/metrics.js";
import {middlewareMetricsInc} from "./middlewares/metrics.js";
import {validateHandler} from "./api/validateHandler.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc, express.static("src/app"));
app.use(middlewareLogResponses);
app.use(express.json());

app.get("/api/healthz", healthReadiness);
app.get("/admin/metrics", adminGetMetrics);
app.post("/admin/reset", adminResetMetrics);
app.get("/api/metrics", getMetrics);
app.get("/api/reset", resetMetrics);
app.post("/api/validate_chirp", validateHandler)

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
