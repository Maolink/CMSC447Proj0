from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import *

router = DefaultRouter()
router.register(r'courses', CollegeCourseViewSet)

# app's URL Config
urlpatterns = [
    path('home/', views.home_page),
    path('', include(router.urls), name="academicPathwayFrontEnd")
]
