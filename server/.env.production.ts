# App
NODE_ENV=production
PORT=3000
API_PREFIX=api
ENABLE_SWAGGER=false
LOG_LEVEL=info


DATABASE_URL=postgresql://hhscdev_user:3c2zUJMUZNUnikp8HHimjM5fkW3k1TO8@dpg-d4it38s9c44c73b49lmg-a.oregon-postgres.render.com/hhscdev?sslmode=require
DB_HOST=dpg-d1nhgns9c44c73eb989g-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=nx_user_prod
DB_PASS=REPLACE_ME
DB_NAME=nx_prod
DB_SSL=true
METRICS_TOKEN=<long-random>


# Auth (rotate regularly)
JWT_SECRET=super-long-random-string
JWT_REFRESH_SECRET=super-long-random-string   # can be different if you prefer
JWT_EXPIRES_IN=15m



# CORS (production domains only)
CORS_ORIGIN=https://yourapp.com,https://api.yourapp.com