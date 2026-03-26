from django.shortcuts import render, get_object_or_404 
# Aquí es donde le decimos a la vista que use AMBOS modelos
from .models import Proyecto, Post 

def home(request):
    proyectos = Proyecto.objects.all()
    # Cambiamos '-fecha_publicacion' por '-fecha_inicio'
    posts = Post.objects.all().order_by('-fecha_inicio') 
    return render(request, 'core/home.html', {
        'proyectos': proyectos,
        'posts': posts
    })

def detalle_proyecto(request, pk):
    proyecto = get_object_or_404(Proyecto, pk=pk)
    return render(request, 'core/detalle_proyecto.html', {'proyecto': proyecto})
    
def detalle_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'core/detalle_post.html', {'post': post})
