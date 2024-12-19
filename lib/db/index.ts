import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Parse connection string from Supabase URL
const getConnectionString = () => {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  return `postgres://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@${url.host}:5432/postgres`;
};

// Create a new connection pool
const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: true,
});

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Export schema types
export * from './schema';
