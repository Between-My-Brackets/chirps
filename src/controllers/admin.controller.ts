import type { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.queries.js";

export async function healthReadiness (req: Request, res: Response){
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

export async function handlerMetrics(_: Request, res: Response) {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileServerHits} times!</p>
  </body>
</html>
`);
}

export async  function handlerReset(req:Request, res:Response) {
    if(config.platform !== "dev"){
        res.status(403).send("This endpoint is only available in development mode.");
        return;
    }

    config.fileServerHits = 0;
    await deleteAllUsers();

    res.write("the server hits are reset to 0 and all the users in the database are deleted.");
    res.end();
}
