from django.urls import path, include
from . import views
from .views import *

# app's URL Config
urlpatterns = [
    path('home/', views.home_page),
    path('', ReactView.as_view(), name="academicPathwayFrontEnd")
]
