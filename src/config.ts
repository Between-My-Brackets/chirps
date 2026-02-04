process.loadEnvFile();


function envOrThrow(key: string): string{
    const value = process.env[key];
    if(!value){
        throw new Error(`Missing Environment variable ${key}`)
    }
    return value;
}

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
};

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL")
};