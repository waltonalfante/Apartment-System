Render deployment instructions
=============================

This project includes a production `Dockerfile` and `render.yaml` to deploy to Render.

Quick steps:

1. Commit and push the repo (ensure `Dockerfile`, `render.yaml` are on `main`).

2. In Render:
   - Import repo using "Import from render.yaml" (recommended) or create a Web Service with Docker.
   - Ensure the following Environment Variables are set in the Web Service and Worker:
     - `APP_ENV=production`
     - `APP_DEBUG=false`
     - `APP_KEY` (generate locally with `php artisan key:generate --show` and set)
     - `APP_URL` (your Render service URL or custom domain)
     - `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
     - Mail settings: `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`
     - `FILESYSTEM_DRIVER=s3` and corresponding `AWS_*` vars if using S3
     - `QUEUE_CONNECTION=database` (or `redis`) and Redis vars if needed

3. Deploy and run migrations from Render shell:

```
php artisan migrate --force
php artisan storage:link
```

4. Verify web, worker, and cron are running.

Notes:
- The Dockerfile runs `npm run build` in the build stage and copies `public/build` into the final image.
- The runtime uses `php-fpm` + `nginx` to serve Laravel on port 8080.
- For zero-downtime and production scaling, consider using managed DB, S3, and external Redis.
