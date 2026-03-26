from django.contrib import admin
from django.urls import path
from core import views
from django.conf import settings # IMPORTANTE
from django.conf.urls.static import static # IMPORTANTE

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('proyecto/<int:pk>/', views.detalle_proyecto, name='detalle_proyecto'),
    path('noticia/<int:pk>/', views.detalle_post, name='detalle_post'),
]

# ESTO HACE QUE LAS IMÁGENES SE VEAN EN DESARROLLO
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
