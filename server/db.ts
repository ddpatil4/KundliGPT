import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const config = require('./config.js');

neonConfig.webSocketConstructor = ws;

const databaseUrl = config.database.url;

if (!databaseUrl) {
  throw new Error(
    "Database URL must be set. Please check your config.js file or DATABASE_URL environment variable.",
  );
}

console.log(`🗄️ Connecting to database: ${databaseUrl.replace(/:[^:]*@/, ':***@')}`);

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
