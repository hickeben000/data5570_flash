# EC2 Deployment

This project is set up to host the Django backend on a single Ubuntu EC2 instance with SQLite stored on that same instance.

## 1. Provision the server

- Launch an Ubuntu EC2 instance.
- Open inbound ports for `22`, `80`, and `443`.
- Point your DNS name to the instance if you have one.

## 2. Install system packages

```bash
sudo apt update
sudo apt install -y python3-venv python3-pip nginx
```

## 3. Copy the repo and create the backend venv

```bash
git clone <your-repo-url> flash_final
cd flash_final/flash_backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
```

## 4. Configure environment variables

Copy `flash_backend/.env.example` to `flash_backend/.env` and set:

- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`
- `SECURE_SSL_REDIRECT=True` once TLS is configured
- `REQUIRE_HTTPS_FOR_AI=True`

Keep `GEMINI_API_KEY` empty if you want strict bring-your-own-key behavior. The app already supports per-user keys through the `X-Gemini-Api-Key` header.

## 5. Migrate and collect static assets

```bash
source .venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
```

## 6. Install the service and nginx config

```bash
sudo cp ../deployment/flash.service /etc/systemd/system/flash.service
sudo cp ../deployment/nginx-flash.conf /etc/nginx/sites-available/flash
sudo ln -s /etc/nginx/sites-available/flash /etc/nginx/sites-enabled/flash
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl enable flash
sudo systemctl start flash
sudo systemctl restart nginx
```

**Gemini / Gunicorn:** Flashcard and quiz generation can take longer than Gunicorn’s default **30s** worker timeout. If workers are killed mid-request, the mobile app often shows a generic **network error**. The bundled `deployment/flash.service` uses `--timeout 180`; if you start Gunicorn by hand, use the same (or similar) timeout flags.

## 7. Verify

```bash
curl http://<your-domain-or-ip>/api/health/
```

Expected response:

```json
{"status":"ok","debug":false}
```

## 8. Add TLS before using live BYOK traffic

Because users can send their own Gemini keys, terminate HTTPS before real usage. A common path is Certbot with nginx:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx
```

After HTTPS is active, set:

- `SECURE_SSL_REDIRECT=True`
- `REQUIRE_HTTPS_FOR_AI=True`

Then restart gunicorn and nginx.
