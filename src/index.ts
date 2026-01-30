import express from "express";

const app = express();
const PORT = 8080;

app.use(express.static("."));

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
