from django.db import models
from django.utils import timezone


# =========================
# EVENTOS Y BITÁCORAS
# =========================

class Post(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()

    fecha_inicio = models.DateField(default=timezone.now)
    fecha_fin = models.DateField(null=True, blank=True)

    # Imagen principal (portada)
    imagen = models.ImageField(
        upload_to='blog/',
        null=True,
        blank=True
    )

    enlace_Evento = models.URLField(
        blank=True,
        null=True,
        help_text="Más información"
    )

    def __str__(self):
        return self.titulo


class PostImage(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='imagenes'
    )

    imagen = models.ImageField(
        upload_to='blog/carrusel/'
    )

    def __str__(self):
        return f"Imagen de {self.post.titulo}"


# =========================
# PROYECTOS DE LABORATORIO
# =========================

class Proyecto(models.Model):
    nombre = models.CharField(max_length=200)

    descripcion_corta = models.CharField(
        max_length=300,
        help_text="Resumen mostrado en la tarjeta."
    )

    documentacion = models.TextField(
        help_text="Descripción técnica completa."
    )

    # Imagen principal del proyecto
    imagen = models.ImageField(
        upload_to='proyectos/',
        null=True,
        blank=True
    )

    fecha_inicio = models.DateField(
        default=timezone.now
    )

    enlace_repositorio = models.URLField(
        blank=True,
        null=True,
        help_text="GitHub / GitLab / Página del proyecto"
    )

    def __str__(self):
        return self.nombre


class ProyectoImage(models.Model):
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name='imagenes'
    )

    imagen = models.ImageField(
        upload_to='proyectos/carrusel/'
    )

    def __str__(self):
        return f"Imagen de {self.proyecto.nombre}"
