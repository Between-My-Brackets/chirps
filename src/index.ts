import express from "express";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("src/app"));
app.use(middlewareLogResponses);
app.get("/healthz", healthReadiness);

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
