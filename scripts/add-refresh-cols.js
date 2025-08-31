const { Client } = require("pg");

(async () => {
  const url = process.env.DATABASE_URL || "";
  // Respect sslmode=require in your Render URL; use CA if provided
  let ssl = false;
  if (/sslmode=require/i.test(url)) {
    const ca = (process.env.PG_CA_CERT || "").replace(/\\n/g, "\n").trim();
    ssl = ca ? { rejectUnauthorized: true, ca } : { rejectUnauthorized: false };
  }

  const c = new Client({ connectionString: url, ssl });
  await c.connect();

  const sql = `
    ALTER TABLE refresh_tokens
      ADD COLUMN IF NOT EXISTS "userId" uuid,
      ADD COLUMN IF NOT EXISTS "expiresAt" timestamptz,
      ADD COLUMN IF NOT EXISTS "userAgent" text,
      ADD COLUMN IF NOT EXISTS "ip" inet;
    CREATE INDEX IF NOT EXISTS "IDX_refresh_tokens_userId" ON refresh_tokens("userId");
  `;
  await c.query(sql);

  const r = await c.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'refresh_tokens'
    ORDER BY ordinal_position;
  `);
  console.table(r.rows);
  await c.end();
})().catch(e => { console.error(e); process.exit(1); });
