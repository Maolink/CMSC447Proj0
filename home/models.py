from django.db import models

# class declarations for a course in the database
# should include Name, Description, Course ID (Ex: CMSC 202) Enrollment requirements, Meeting times (Ex: MoWe 1:00pm-4:10pm)
# Room Number? Prequisities
# Ethan Lackner
class CollegeCourse(models.Model):
    name = models.CharField(max_length=255)
    major = models.CharField(max_length=255, default="")
    course_id = models.CharField(max_length=50, unique=True)
    credits = models.CharField(max_length=1, default=3)
    semester = models.CharField(max_length=11, default="")
    advisorRecs = models.TextField(default="")
    description = models.TextField(default="")
    enrollment_requirements = models.TextField(default="")
    meeting_times = models.JSONField()  # Stores meeting times as a dictionary
    room = models.CharField(max_length=100, default="")
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
    
class Schedule(models.Model):
    name = models.CharField(max_length=255)
    courses = models.ManyToManyField(CollegeCourse, related_name="schedules", blank=True)
    def __str__(self):
        return self.name
    
    def get_course_names(self):
        """returns a list of names of all courses in the schedule"""
        return[course.name for course in self.courses.all()]
    
    def filter_by_meeting_time(self, day, time=None):
        """
        returns list of courses that meet on a specific day, and optionally a specific time
        param day: day of week (e.g. day of the week (e.g. "monday")
        param time: specific time to filter by (e.g., "10:00AM - 11:30 AM")
        """
        filtered_courses = self.courses.filter(meeting_times__has_key=day)

        if time:
            filtered_courses = filtered_courses.filter(meeting_times__contains={day: time})
        
        return filtered_courses

    def filter_by_room(self, room):
        """
        returns list of courses that meet in specific room
        param room: room number or name (e.g. "room 101")
        """
        return self.courses.filter(room=room)
    
    def filter_by_prereq(self, prereq_course):
        """
        returns a list of courses that require a specific prereq
        param prereq_course: a CollegeCourse instance to check if any courses have it as a prerequisite
        """
        return self.courses.filter(prerequisites=prereq_course)
    
    def add_course(self, course):
        """Adds a course object (param course) into the schedule"""
        self.courses.add(course)

    def remove_course(self, course):
        """Removes a course from the schedule"""
        self.courses.remove(course)
    
    def update_schedule_name(self, new_name):
        """changes the name of schedule object"""
        self.name = new_name
        self.save()

class AcademicPathway(models.Model):
    """
    this is a class that will represent the full academic pathway over four years of college
    """
    name = models.CharField(max_length=255)

    # each year has two semesters
    freshman_fall = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="freshman_fall_schedule")
    freshman_spring = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="freshman_spring_schedule")

    sophomore_fall = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="sophomore_fall_schedule")
    sophomore_spring = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="sophomore_spring_schedule")

    junior_fall = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="junior_fall_schedule")
    junior_spring = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="junior_spring_schedule")

    senior_fall = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="senior_fall_schedule")
    senior_spring = models.OneToOneField("Schedule", on_delete=models.SET_NULL, null=True, related_name="senior_spring_schedule")

    def get_schedule_for_sem(self, year, semester):
        """
        returns Schdule object for a given year and semester
        param year: "freshman", "sophomore", "junior", "senior"
        param semester: "fall" or "spring"
        """
        schedule_attr = f"{year}_{semester}"
        return getattr(self, schedule_attr, None)
    
    def update_schedule_for_sem(self, year, semester, new_schedule):
        """
        updates a Schedule object for a given year and semester
        param year: "freshman", "sophomore", "junior", "senior"
        param semester: "fall" or "spring"
        param new_schedule: Schedule instance to be assigned
        """
        schedule_attr = f"{year}_{semester}"
        setattr(self, schedule_attr, new_schedule)
        self.save()

    def get_all_schedules(self):
        """
        returns dictionary of all schedules within the AcademicPathway
        """
        return {
            "Freshman Fall": self.freshman_fall,
            "Freshman Spring": self.freshman_spring,
            "Sophomore Fall": self.sophomore_fall,
            "Sophomore Spring": self.sophomore_spring,
            "Junior Fall": self.junior_fall,
            "Junior Spring": self.junior_spring,
            "Senior Fall": self.senior_fall,
            "Senior Spring": self.senior_spring,
        }
    def __str__(self):
        return f"Academic Pathway for {self.student_name}"