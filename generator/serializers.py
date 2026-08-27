from rest_framework import serializers
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

    class Meta:
        model = GeneratedImage
        fields = ['id', 'prompt', 'image', 'image_url', 'created_at']
        read_only_fields = ['id', 'image', 'image_url', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None