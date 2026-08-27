import io
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.core.files.base import ContentFile
from PIL import Image

from .serializers import GenerateImageSerializer, GeneratedImageSerializer
from .models import GeneratedImage
from .services.pollination_service import (
    PollinationService,
    PollinationConfigurationError,
    PollinationGenerationError,
    PollinationNoImageError,
)

logger = logging.getLogger(__name__)

class GenerateImageView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        serializer = GenerateImageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        prompt = serializer.validated_data['prompt']

        try:
            pollination_service = PollinationService()
        except PollinationConfigurationError as e:
            logger.error(f"Pollination configuration error: {e}")
            return Response({
                'status': False,
                'message': 'Server configuration error',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            image_bytes, mime_type = pollination_service.generate_image(prompt)
        except PollinationGenerationError as e:
            logger.error(f"Pollination generation error: {e}")
            return Response({
                'status': False,
                'message': 'Image generation failed',
                'error': str(e)
            }, status=status.HTTP_502_BAD_GATEWAY)
        except PollinationNoImageError as e:
            logger.error(f"Pollination no image error: {e}")
            return Response({
                'status': False,
                'message': 'No image generated',
                'error': str(e)
            }, status=status.HTTP_502_BAD_GATEWAY)

        try:
            image_file = self._save_image(image_bytes, mime_type, prompt)
        except Exception as e:
            return Response({
                'status': False,
                'message': 'Failed to save generated image',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        generated_image = GeneratedImage.objects.create(
            prompt=prompt,
            image=image_file
        )

        response_serializer = GeneratedImageSerializer(
            generated_image, 
            context={'request': request}
        )

        return Response({
            'status': True,
            'message': 'Image generated successfully',
            'data': response_serializer.data
        }, status=status.HTTP_201_CREATED)

    def _save_image(self, image_bytes: bytes, mime_type: str, prompt: str) -> ContentFile:
        """
        Save image bytes to a Django ContentFile with proper format detection.
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")

        format_map = {
            'image/png': 'PNG',
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPEG',
            'image/webp': 'WEBP',
        }
        pil_format = format_map.get(mime_type, 'PNG')

        output = io.BytesIO()
        image.save(output, format=pil_format)
        output.seek(0)

        ext = pil_format.lower()
        if ext == 'jpeg':
            ext = 'jpg'

        filename = f'generated_{GeneratedImage._meta.model.__name__.lower()}_{hash(prompt) % 1000000}.{ext}'
        
        return ContentFile(output.read(), name=filename)