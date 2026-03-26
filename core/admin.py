from django.contrib import admin
from .models import Post, Proyecto  # Importamos ambos modelos

# Registramos el Blog
admin.site.register(Post)

# Registramos el Proyecto de Laboratorio
admin.site.register(Proyecto)
