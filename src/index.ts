import express from "express";
// import postgres from "postgres";
// import {migrate} from "drizzle-orm/postgres-js/migrator";
// import {drizzle} from "drizzle-orm/postgres-js";
// import {config} from "./config.js";
import {healthReadiness} from "./api/readiness.js";
import {middlewareLogResponses} from "./middlewares/logging.js";
import {handlerMetrics} from "./api/metrics.js";
import {handlerReset} from "./api/reset.js";
import {middlewareMetricsInc} from "./middlewares/metrics.js";
import {createChirpController, getChirpByIdController, getChirpsController, deleteChirpController} from "./api/chirpHandler.js"; // Corrected import
import {errorHandler} from "./middlewares/errorHandling.js";
import {createUserController, updateUserController} from "./api/users.js";
import {loginController} from "./api/login.js";
import {refreshController} from "./api/refresh.js";
import {revokeController} from "./api/revoke.js";
import {authenticate} from "./middlewares/auth.js";
import {polkaWebhookController} from "./api/polkaWebhooks.js";

// const migrationClient = postgres(config.db.url, { max: 1});
// await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app",middlewareMetricsInc, express.static("src/app"));

//==========api routes===========
app.get("/api/healthz", healthReadiness);
app.post("/api/users", createUserController);
app.put("/api/users", authenticate, updateUserController);
app.post("/api/login", loginController);
app.post("/api/refresh", refreshController);
app.post("/api/revoke", revokeController);
app.post("/api/polka/webhooks", polkaWebhookController)

//==========admin routes============
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res).catch(next))
});

app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res).catch(next))
});

//=========chirp routes===========
app.post("/api/chirps", authenticate, async(req, res, next) => {
    try{
        await createChirpController(req, res); // Corrected function call
    }
    catch(err){
        next(err);
    }
})

app.get("/api/chirps", async(req, res, next) => { // REMOVED 'authenticate' MIDDLEWARE
    try{
        await getChirpsController(req, res);
    }
    catch(err){
        next(err);
    }
})

app.get("/api/chirps/:chirpId", async (req, res, next) => { // REMOVED 'authenticate' MIDDLEWARE
    try{
        await getChirpByIdController(req, res);
    }
    catch(err){
        next(err);
    }
})

app.delete("/api/chirps/:chirpId", authenticate, async(req, res, next) => { // ADDED LEADING SLASH
    try{
        await deleteChirpController(req, res);
    }catch(err){
        next(err);
    }
})
//=====================================================
app.use(errorHandler);


const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();