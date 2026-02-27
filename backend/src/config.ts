import {MigrationConfig} from "drizzle-orm/migrator";
import "dotenv/config";


function envOrThrow(key: string): string{
    const value = process.env[key];
    if(!value){
        throw new Error(`Missing Environment variable ${key}`)
    }
    return value;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

type APIConfig = {
    fileServerHits: number;
    db: DBConfig;
    platform: string;
    jwt: {
        secret: string;
        tokenExpiresInSeconds: number;
    };
    polkaKey: string;
};

export const config: APIConfig = {
    fileServerHits: 0,
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: {
            migrationsFolder: "./src/db/migrations",
            migrationsSchema: "drizzle",
            migrationsTable: "migrations"
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
        tokenExpiresInSeconds: 3600,
    },
    platform: envOrThrow("PLATFORM"),
    polkaKey: envOrThrow("POLKA_KEY")
};
