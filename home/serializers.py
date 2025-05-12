from rest_framework import serializers
from .models import *

class CollegeCourseSerializer(serializers.ModelSerializer):
    prerequisites = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CollegeCourse.objects.all(), required=False
    )
    description  = serializers.SerializerMethodField()
    room = serializers.SerializerMethodField()

    class Meta:
        model = CollegeCourse
        fields = '__all__'
        # fields = ['name', 'course_id', 'major', 'description', 'credits', 'enrollment_requirements', 'meeting_times', 'room', 'prerequisites']
        #incomplete
    
    def get_description(self, obj):
        return obj.description if obj.description else "No description available at this time."
    
    def get_room(self, obj):
        return obj.room if obj.room else "There is no room assigned at this time."
    
    def get_recs(self, obj):
        return obj.advisorRecs if obj.advisorRecs else "Your advisor has not submitted any reccommendations about this class at this time."
    

class ScheduleSerializer(serializers.ModelSerializer):
    courses = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CollegeCourse.objects.all(), required=False
    )

    class Meta:
        model = Schedule
        fields = '__all__'