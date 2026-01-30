import express from "express";

const app = express();
const PORT = 8080;

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is listening to the port ${PORT}`);
    });
}

startServer();
