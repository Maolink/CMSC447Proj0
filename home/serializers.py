from rest_framework import serializers
from .models import *

class CollegeCourseSerializer(serializers.ModelSerializer):
    prerequisites = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CollegeCourse.objects.all(), required=False
    )

    class Meta:
        model = CollegeCourse
        fields = '__all__'
        # fields = ['name', 'course_id', 'major', 'description', 'credits', 'enrollment_requirements', 'meeting_times', 'room', 'prerequisites']

class ScheduleSerializer(serializers.ModelSerializer):
    courses = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CollegeCourse.objects.all(), required=False
    )

    class Meta:
        model = Schedule
        fields = '__all__'