import io
import logging
from typing import Tuple

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class PollinationServiceError(Exception):
    pass


class PollinationConfigurationError(PollinationServiceError):
    pass


class PollinationGenerationError(PollinationServiceError):
    pass


class PollinationNoImageError(PollinationServiceError):
    pass


class PollinationService:
    BASE_URL = "https://image.pollinations.ai"
    MODEL = "flux"
    ENDPOINT = "/prompt/"

    def __init__(self):
        self.api_key = getattr(settings, 'POLLINATION_API_KEY', None)
        if not self.api_key:
            raise PollinationConfigurationError("POLLINATION_API_KEY is not configured in settings.")

    def generate_image(self, prompt: str) -> Tuple[bytes, str]:
        # Generate an image from a text prompt using Pollination AI. Returns: Tuple of (image_bytes, mime_type)
        url = f"{self.BASE_URL}{self.ENDPOINT}{prompt}"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "image/*",
        }

        params = {
            "model": self.MODEL,
            "width": 1024,
            "height": 1024,
            "seed": -1,
            "nologo": "true",
            "private": "true",
        }

        try:
            response = requests.get(
                url,
                headers=headers,
                params=params,
                timeout=60,
            )
        except requests.exceptions.Timeout:
            raise PollinationGenerationError("Pollination AI request timed out")
        except requests.exceptions.RequestException as e:
            raise PollinationGenerationError(f"Pollination AI request failed: {str(e)}")

        if response.status_code == 401:
            raise PollinationGenerationError("Invalid Pollination AI API key")
        elif response.status_code == 403:
            raise PollinationGenerationError("Pollination AI API key lacks permissions")
        elif response.status_code == 429:
            raise PollinationGenerationError("Pollination AI rate limit exceeded")
        elif response.status_code >= 500:
            raise PollinationGenerationError(f"Pollination AI server error: {response.status_code}")
        elif response.status_code != 200:
            try:
                error_detail = response.json()
            except Exception:
                error_detail = response.text
            raise PollinationGenerationError(f"Pollination AI error ({response.status_code}): {error_detail}")

        content_type = response.headers.get("Content-Type", "")
        if not content_type.startswith("image/"):
            raise PollinationNoImageError(f"Unexpected response content type: {content_type}")

        image_bytes = response.content
        if not image_bytes:
            raise PollinationNoImageError("Pollination AI returned empty image data")

        return image_bytes, content_type