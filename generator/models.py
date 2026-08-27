import uuid
from django.db import models

def generated_image_upload_to(instance, filename):
    ext = filename.split('.')[-1].lower()
    return f'generated/generated_{uuid.uuid4().hex}.{ext}'

class GeneratedImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prompt = models.TextField()
    image = models.ImageField(upload_to=generated_image_upload_to)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"GeneratedImage {self.id} - {self.prompt[:50]}"