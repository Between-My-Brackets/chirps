import express from "express";
import postgres from "postgres";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";
import {config} from "./config.js";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";
import {handlerMetrics} from "./api/metrics.js";
import {handlerReset} from "./api/reset.js";
import {middlewareMetricsInc} from "./middlewares/metrics.js";
import {createChirpController, getChirpByIdController, getChirpsController} from "./api/chirpHandler.js"; // Corrected import
import {errorHandler} from "./middlewares/errorHandling.js";
import {createUserController} from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app",middlewareMetricsInc, express.static("src/app"));

app.get("/api/healthz", healthReadiness);
app.post("/api/users", createUserController);
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res).catch(next))
});

app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res).catch(next))
});

app.post("/api/chirps", async(req, res, next) => {
    try{
        await createChirpController(req, res); // Corrected function call
    }
    catch(err){
        next(err);
    }
})

app.get("/api/chirps", async(req, res, next) => {
    try{
        await getChirpsController(req, res);
    }
    catch(err){
        next(err);
    }
})

app.get("/api/chirps/:chirpId", async (req, res, next) => {
    try{
        await getChirpByIdController(req, res);
    }
    catch(err){
        next(err);
    }
})

app.use(errorHandler);


const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();