from django.urls import path
from . import views

urlpatterns = [
    path('generate-story/', views.generate_story, name='generate-story'),
    path('generate-audio/', views.generate_audio, name='generate-audio'),   
]
