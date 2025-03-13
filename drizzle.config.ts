import { config } from 'dotenv';
import { Config } from 'drizzle-kit';

config({
  path: '.env.local',
});

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  // dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_URL!,
    port: parseInt(process.env.POSTGRES_URL_PORT!),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE!
  },
} satisfies Config;

// export default defineConfig({
//   schema: './lib/db/schema.ts',
//   out: './lib/db/migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     // biome-ignore lint: Forbidden non-null assertion.
//     url: process.env.POSTGRES_URL!,
//   },
// });
