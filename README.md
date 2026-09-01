# imaginAI - AI Image Generator

A Django REST API with React frontend for generating images using Pollination AI (Flux model).

## Features

- **AI Image Generation** - Create high-quality images from text prompts using Pollination AI's Flux model
- **Image Gallery** - Browse all generated images with infinite scroll pagination
- **Image Details** - View full-size images with metadata (prompt, creation date)
- **Download Images** - Save generated images locally with descriptive filenames
- **Delete Images** - Remove unwanted generations with confirmation dialog
- **Real-time Validation** - Client-side prompt validation with character count
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Error Handling** - Comprehensive error states with user-friendly messages
- **Loading States** - Skeleton loaders and progress indicators
- **CSRF Protection** - Secure API communication with Django CSRF tokens

## How It Works

1. **User enters a prompt** in the Generate page describing the desired image
2. **Frontend sends POST request** to `/api/generate-image/` with the prompt
3. **Django backend validates** the prompt and calls Pollination AI service
4. **Pollination AI (Flux model)** generates a 1024x1024 image based on the prompt
5. **Backend saves image** to PostgreSQL database and local media storage
6. **Response returns** the generated image URL and metadata
7. **Frontend displays** the image with options to download, view details, or generate another

## Quick Start

### Backend (Django)

```bash
cd imaginAI
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your keys
python manage.py migrate
python manage.py runserver
```

### Frontend (React + Vite)

```bash
cd imaginAI/frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` in `imaginAI/`:

```env
DJANGO_SECRET_KEY=your-secret-key
POLLINATION_API_KEY=your-pollination-key
POSTGRES_DB=image_generator
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

Get Pollination API key: https://pollinations.ai/

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate-image/` | Generate new image from prompt |
| `GET` | `/api/images/` | List all generations (paginated) |
| `GET` | `/api/images/{uuid}/` | Get generation detail by UUID |
| `DELETE` | `/api/images/{uuid}/` | Delete a generated image |

### Request/Response Examples

**Generate Image**
```bash
curl -X POST http://localhost:8000/api/generate-image/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: your-csrf-token" \
  -d '{"prompt": "A cyberpunk cityscape at sunset"}'
```

**Response:**
```json
{
  "status": true,
  "message": "Image generated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "short_prompt": "A cyberpunk cityscape at sunset...",
    "image_url": "http://localhost:8000/media/generated/generated_abc123.png",
    "created_at": "2026-08-29T10:30:00Z"
  }
}
```

**List Images (Paginated)**
```bash
curl http://localhost:8000/api/images/?page=1&page_size=20
```

**Response:**
```json
{
  "status": true,
  "message": "Images retrieved successfully",
  "data": {
    "count": 42,
    "total_pages": 3,
    "current_page": 1,
    "next": "http://localhost:8000/api/images/?page=2",
    "previous": null,
    "results": [...]
  }
}
```

## Usage

### Generating Images

1. Navigate to the homepage (`/`)
2. Enter a descriptive prompt in the text area (max 10,000 characters)
3. Press **Enter** or click **Generate Image**
4. Wait for generation (typically 10-30 seconds)
5. View the result with options to:
   - **Download** the image
   - **Generate Another** image
   - **View in My Generations** for full details

### Managing Generations

- Visit **My Generations** (`/generations`) to see all your images
- Grid layout adapts to screen size (3-5 columns)
- Infinite scroll loads more images automatically
- Click any image to view **Image Detail** page
- On detail page: view full prompt, download, or delete image

### Prompt Tips

- Be specific: "A majestic lion in savanna at golden hour, photorealistic"
- Include style: "Oil painting of a mountain landscape, impressionist style"
- Mention lighting: "Portrait with dramatic rim lighting, cinematic"
- Add details: "Futuristic car interior, neon lights, 8k resolution, unreal engine 5"

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 5.x, Django REST Framework |
| Database | PostgreSQL |
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| AI Provider | Pollination AI (Flux model) |
| Image Processing | Pillow (PIL) |
| Deployment Ready | Gunicorn, Whitenoise, PostgreSQL |

## Project Structure

```
imaginAI/
├── imaginAI_app/           # Django app
│   ├── models.py           # GeneratedImage model (UUID, prompt, image, created_at)
│   ├── views.py            # API views (generate, list, detail, delete)
│   ├── serializers.py      # DRF serializers with image URL handling
│   ├── urls.py             # API routing
│   ├── services/           # Pollination AI integration
│   └── pagination.py       # Custom pagination response
├── imaginAI_project/       # Django project settings
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── api/            # API client with CSRF handling
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (Toast notifications)
│   │   ├── hooks/          # Custom hooks (useImages, etc.)
│   │   ├── pages/          # Page components (Generate, MyGenerations, ImageDetail)
│   │   └── types/          # TypeScript types
│   └── package.json
└── media/                  # Uploaded/generated images
```

## Development

### Running Tests

```bash
# Backend
cd imaginAI
python manage.py test

# Frontend
cd imaginAI/frontend
npm test
```

### Building for Production

```bash
# Frontend build
cd imaginAI/frontend
npm run build

# Backend collect static
cd imaginAI
python manage.py collectstatic
```

## License

MIT License - feel free to use and modify for your projects.