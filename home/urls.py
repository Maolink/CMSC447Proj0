from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import *

router = DefaultRouter()
router.register(r'courses', CollegeCourseViewSet)
router.register(r'schedules', ScheduleViewSet)

# app's URL Config
urlpatterns = [
    path('home/', views.home_page),
    path('', include(router.urls), name="academicPathwayFrontEnd"),
    path('api/', include(router.urls)),
    path('api/courses/create/', create_college_course, name='createCourse'),
]
