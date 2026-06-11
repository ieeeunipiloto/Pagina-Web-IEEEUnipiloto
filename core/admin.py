from django.contrib import admin
from .models import (
    Post,
    PostImage,
    Proyecto,
    ProyectoImage
)


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline]


class ProyectoImageInline(admin.TabularInline):
    model = ProyectoImage
    extra = 1


@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    inlines = [ProyectoImageInline]
