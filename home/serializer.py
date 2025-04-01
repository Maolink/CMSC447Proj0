from rest_framework import serializers
from .models import *

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeCourse
        fields = ['name', 'course_id', 'description', 'enrollment_requirements', 'meeting_times', 'room', 'prerequisites']
        