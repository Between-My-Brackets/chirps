import { app } from "./app.js";
const PORT = 8080;

// Start Server
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
}

startServer();
