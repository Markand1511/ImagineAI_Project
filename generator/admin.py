from django.contrib import admin
from .models import GeneratedImage

@admin.register(GeneratedImage)
class GeneratedImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'prompt_preview', 'image_thumbnail', 'created_at']
    list_filter = ['created_at']
    search_fields = ['prompt']
    readonly_fields = ['id', 'image_preview', 'created_at']
    ordering = ['-created_at']

    def prompt_preview(self, obj):
        return obj.prompt[:100] + '...' if len(obj.prompt) > 100 else obj.prompt
    prompt_preview.short_description = 'Prompt'

    def image_thumbnail(self, obj):
        if obj.image:
            from django.utils.html import format_html
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return '-'
    image_thumbnail.short_description = 'Image'

    def image_preview(self, obj):
        if obj.image:
            from django.utils.html import format_html
            return format_html('<img src="{}" width="300" style="max-height: 300px;" />', obj.image.url)
        return 'No image'
    image_preview.short_description = 'Preview'