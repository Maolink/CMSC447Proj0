from rest_framework import serializers
from .models import *

class CollegeCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeCourse
        fields = '__all__'
        # fields = ['name', 'course_id', 'description', 'enrollment_requirements', 'meeting_times', 'room', 'prerequisites']