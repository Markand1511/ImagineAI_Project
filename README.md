# Image Generator API - Run Guide

**Project name:** image_generator_project  
**App name:** generator  
*(These are intentionally DIFFERENT. Do not rename them to the same name.)*

## 1. Open terminal

```bash
cd image_generator_project
```

## 2. Activate virtual environment

Windows:
```bash
venv\Scripts\activate
```

## 3. Install packages

```bash
pip install -r requirements.txt
```

## 4. Configure .env

Add to `.env` file:

```env
POLLINATION_API_KEY=Your_POLLINATION_API_KEY
POSTGRES_DB=" "
POSTGRES_USER=" "
POSTGRES_PASSWORD=" "
POSTGRES_HOST=" "
POSTGRES_PORT=" "
```

## 5. Run migrations

```bash
python manage.py migrate
```

## 6. Check project

```bash
python manage.py check
```

## 7. Start server

```bash
python manage.py runserver
```

## 8. Test with Postman

POST:
```
http://127.0.0.1:8000/api/generate-image/
```

Headers:
```
Content-Type: application/json
```

Body:
```json
{
    "prompt": "Create a photorealistic premium luxury gold necklace product photograph on a dark black background, elegant professional studio lighting, realistic gold reflections, highly detailed jewellery photography, sharp focus, commercial product photography."
}
```

## 9. Open generated image

Copy `image_url` from the response and open it in browser.

## Where generated images are stored

Images are saved to: `media/generated/` with unique filenames (e.g., `generated_<uuid>.png`)

## Common Errors

| Error | Solution |
|-------|----------|
| PostgreSQL connection error | Verify PostgreSQL is running, check credentials in `.env`, ensure database `image_generator` exists |
| Missing POLLINATION API key | Add `POLLINATION_API_KEY` to `.env` file |
| Migration error | Run `python manage.py makemigrations` then `python manage.py migrate` |
| Port already in use | Use `python manage.py runserver 8001` or kill process on port 8000 |
| Pillow install failed | Install system dependencies (zlib) or use `pip install --pre Pillow` |