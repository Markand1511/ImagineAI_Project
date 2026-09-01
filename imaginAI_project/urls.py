from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from .views import FrontendAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('imaginAI_app.urls')),
]

# Serve React app for all non-API routes
urlpatterns += [
    re_path(r'^(?!api/|admin/|media/|static/).*/?', FrontendAppView.as_view(), name='frontend'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)