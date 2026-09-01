from rest_framework import serializers
# pyrefly: ignore [missing-import]
from .models import GeneratedImage

class GenerateImageSerializer(serializers.Serializer):
    prompt = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        max_length=10000,
        error_messages={
            'required': 'Prompt is required.',
            'blank': 'Prompt cannot be empty.',
        }
    )

    def validate_prompt(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Prompt cannot be empty.")
        return value.strip()

class GeneratedImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    short_prompt = serializers.SerializerMethodField()

    class Meta:
        model = GeneratedImage
        fields = ['id', 'short_prompt', 'image_url', 'created_at']
        read_only_fields = ['id', 'short_prompt', 'image_url', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            try:
                # Check if the physical file exists on storage
                if not obj.image.storage.exists(obj.image.name):
                    return None
                url = obj.image.url
                if request:
                    return request.build_absolute_uri(url)
                return url
            except (ValueError, FileNotFoundError):
                return None
        return None

    def get_short_prompt(self, obj):
        if obj.prompt and len(obj.prompt) > 100:
            return obj.prompt[:100] + '...'
        return obj.prompt