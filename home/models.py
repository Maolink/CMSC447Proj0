from django.db import models

# Create your models here.
# class declarations for a course in the database
# should include Name, Description, Course ID (Ex: CMSC 202) Enrollment requirements, Meeting times (Ex: MoWe 1:00pm-4:10pm)
# Room Number? Prequisities
# Ethan Lackner
# 

class CollegeCourse(models.Model):
    name = models.CharField(max_length=255)
    course_id = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    enrollment_requirements = models.TextField()
    meeting_times = models.JSONField()  # Stores meeting times as a dictionary
    room = models.CharField(max_length=100)
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
        return f"{self.name} ({self.course_id})"

    def add_prerequisite(self, prerequisite):
        """Adds a prerequisite to the course."""
        self.prerequisites.add(prerequisite)
    
    def update_meeting_time(self, day, time):
        """Updates the meeting time for a specific day."""
        self.meeting_times[day] = time
        self.save()
    
    def update_room(self, new_room):
        """Updates the room assignment."""
        self.room = new_room
        self.save()
    
    