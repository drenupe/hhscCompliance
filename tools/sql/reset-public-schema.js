const { Client } = require("pg");

(async () => {
  const c = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // ok for Render managed certs in dev
  });
  await c.connect();

  console.log("Dropping schema public…");
  await c.query("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");

  // Optional: restore basic privileges (usually default is fine on Render)
  // await c.query(`GRANT ALL ON SCHEMA public TO ${process.env.DB_USER || 'public'};`);

  console.log("Schema recreated. Listing tables (should be empty):");
  const r = await c.query(`SELECT table_name FROM information_schema.tables
                           WHERE table_schema='public' ORDER BY table_name;`);
  console.table(r.rows);

  await c.end();
  console.log("Done.");
})().catch(err => { console.error(err); process.exit(1); });
