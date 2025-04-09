from rest_framework import serializers
from .models import *

class CollegeCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeCourse
        fields = ['name', 'course_id', 'description', 'enrollment_requirements', 'meeting_times', 'room', 'prerequisites']

class planClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeCourse
        fields = ['name', 'course_id']   