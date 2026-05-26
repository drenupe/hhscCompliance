NODE_ENV=staging
PORT=3000
API_PREFIX=api
ENABLE_SWAGGER=true
ENABLE_METRICS=true

DATABASE_URL=postgresql://nx_user:KQLZbLZrkB5TF18RB6pwksu0q8rOBAwW@dpg-d1nhgns9c44c73eb989g-a.oregon-postgres.render.com/nx_dev?sslmode=require
DB_SSL=true

JWT_SECRET=super-long-random-string
JWT_REFRESH_SECRET=another-super-long-random-string
JWT_EXPIRES_IN=15m

CORS_ORIGIN=https://staging.yourapp.com