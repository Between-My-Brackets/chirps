import { defineConfig } from "drizzle-kit";


export default defineConfig({
    schema: "src/db/schema.ts",
    out: "src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_9PgSlJseb4Ad@ep-steep-term-a17quiij-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    },
});