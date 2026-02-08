import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
});

export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar("body", {length: 256}).notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade"}),
});


//"one user has many chirps" => user.chirps[]
export const usersRelations = relations(users, ({many}) => ({
    chirps: many(chirps)
}))

//"many chirps belong to one user" => chirps.author
export const chirpsRelations = relations(chirps, ({ one }) => ({
     author: one(users, {
         fields: [chirps.userId],
         references: [users.id],
    }),
}));

export type NewUser = typeof users.$inferInsert;
export type NewChirp = typeof chirps.$inferInsert;



// the SQL equivalent of the above code
// -- Enable UUID extension (run once per database)
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
//
// -- Users table
// CREATE TABLE users (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     email VARCHAR(256) UNIQUE NOT NULL
// );
//
// -- Create trigger function for updated_at (run once)
// CREATE OR REPLACE FUNCTION update_updated_at_column()
// RETURNS TRIGGER AS $$
// BEGIN
// NEW.updated_at = NOW();
// RETURN NEW;
// END;
// $$ language 'plpgsql';
//
// -- Create trigger for users table
// CREATE TRIGGER update_users_updated_at
// BEFORE UPDATE ON users
// FOR EACH ROW
// EXECUTE FUNCTION update_updated_at_column();
//
// -- Chirps table
// CREATE TABLE chirps (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     body VARCHAR(256) NOT NULL,
//     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
// );
//
// -- Create trigger for chirps table
// CREATE TRIGGER update_chirps_updated_at
// BEFORE UPDATE ON chirps
// FOR EACH ROW
// EXECUTE FUNCTION update_updated_at_column();
