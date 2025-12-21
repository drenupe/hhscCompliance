# App
NODE_ENV=staging
PORT=3000
API_PREFIX=api
ENABLE_SWAGGER=true
ENABLE_METRICS=true


# DB (use your STAGING database; create separate creds if possible)
DATABASE_URL=postgresql://nx_user:KQLZbLZrkB5TF18RB6pwksu0q8rOBAwW@dpg-d1nhgns9c44c73eb989g-a.oregon-postgres.render.com/nx_dev?sslmode=require
DB_HOST=dpg-d1nhgns9c44c73eb989g-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=nx_user
DB_PASS=REPLACE_ME
DB_NAME=nx_stage
DB_SSL=true


# Auth

JWT_SECRET=super-long-random-string
JWT_REFRESH_SECRET=super-long-random-string   # can be different if you prefer
JWT_EXPIRES_IN=15m



# CORS (staging frontend only)
CORS_ORIGIN=https://staging.yourapp.com