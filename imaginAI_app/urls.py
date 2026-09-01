from django.urls import path
from .views import GenerateImageView, GeneratedImageListView, GeneratedImageDetailView

urlpatterns = [
    path('generate-image/', GenerateImageView.as_view(), name='generate-image'),
    path('images/', GeneratedImageListView.as_view(), name='list-images'),
    path('images/<uuid:pk>/', GeneratedImageDetailView.as_view(), name='image-detail'),
]