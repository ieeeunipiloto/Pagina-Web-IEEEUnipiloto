from django.db import models
from django.utils import timezone

# Modelo del Blog (ya lo tienes, lo dejamos igual)
class Post(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    fecha_inicio = models.DateField(default=timezone.now)
    fecha_fin = models.DateField(null=True, blank=True)
    imagen = models.ImageField(upload_to='blog/', null=True, blank=True)
    enlace_Evento = models.URLField(blank=True, null=True, help_text="Más información")

    def __underline__str__(self):
        return self.titulo

# NUEVO MODELO: Proyecto de Laboratorio / Portafolio
class Proyecto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion_corta = models.CharField(max_length=300, help_text="Un resumen rápido para la tarjeta.")
    documentacion = models.TextField(help_text="Detalles técnicos completos.")
    imagen = models.ImageField(upload_to='proyectos/', null=True, blank=True) 
    fecha_inicio = models.DateField(default=timezone.now)
    enlace_repositorio = models.URLField(blank=True, null=True, help_text="GitHub/GitLab")

    def __str__(self):
        return self.nombre
