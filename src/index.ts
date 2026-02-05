import express from "express";
import postgres from "postgres";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";
import {config} from "./config";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";
import {handlerMetrics} from "./api/metrics.js";
import {handlerReset} from "./api/reset.js";
import {middlewareMetricsInc} from "./middlewares/metrics.js";
import {validateHandler} from "./api/validateHandler.js";
import {errorHandler} from "./middlewares/errorHandling.js";

const migrationClient = postgres(config.db.url, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app",middlewareMetricsInc, express.static("src/app"));

app.get("/api/healthz", healthReadiness);
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res).catch(next))
});

app.get("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res).catch(next))
});

app.post("/api/validate_chirp", async(req, res, next) => {
    try{
        await validateHandler(req,res);
    }catch (err){
        next(err);
    }
});

app.use(errorHandler);


const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
