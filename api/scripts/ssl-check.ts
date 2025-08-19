// api/scripts/ssl-check.ts
import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  // Turn escaped "\n" back into real newlines if PG_CA_CERT is set
  const caRaw = process.env.PG_CA_CERT ?? '';
  const ca = caRaw ? caRaw.replace(/\\n/g, '\n') : undefined;

  // Build the ssl option for 'pg'
  const ssl =
    ca ? { ca } :
    process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } :
    undefined;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: ssl as any,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Postgres');

    // Quick sanity: SHOW ssl (may say 'on' even without negotiated SSL)
    try {
      const show = await client.query('SHOW ssl');
      console.log('SHOW ssl:', show.rows?.[0]?.ssl);
    } catch (e) {
      /* ignore */
    }

    // Best-effort: pg_stat_ssl (some hosts restrict this view)
    try {
      const r = await client.query(
        'SELECT ssl, version, cipher, bits FROM pg_stat_ssl WHERE pid = pg_backend_pid()'
      );
      if (r.rows?.[0]) {
        console.log('pg_stat_ssl:', r.rows[0]); // { ssl: true, version: 'TLSv1.3', ... }
      } else {
        console.log('pg_stat_ssl returned no rows (view may be restricted).');
      }
    } catch (err: any) {
      console.log('pg_stat_ssl not accessible:', err.message);
    }
  } catch (err: any) {
    console.error('❌ Failed to connect:', err.message);
    process.exit(1);
  } finally {
    try { await client.end(); } catch {}
  }
}

main();
