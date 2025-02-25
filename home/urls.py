from django.urls import path
from . import views

# app's URL Config
urlpatterns = [
    path('home/', views.home_page)
]
