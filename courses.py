# class declarations for a course in the database
# should include Name, Description, Course ID (Ex: CMSC 202) Enrollment requirements, Meeting times (Ex: MoWe 1:00pm-4:10pm)
# Room Number? Prequisities
# Ethan Lackner
# 

class coeit_course:
    def __init__(self, course_name, course_id, course_desc, enroll_req, meet_times, course_room, prereq=None):
        """
        Inits a coeit_course object.

        course_name: name of the course (Ex: Software Development)
        course_id: ID for this course (Ex: CMSC447)
        course_desc: brief description of the course
        enroll_req: any specific enrollment conditions
        meet_times: dictionary with days and times
        course_room: the room the course is in
        prereq: list of prerequisite courses
        """
        self.course_name = course_name
        self.course_id = course_id
        self.course_desc = course_desc
        self.enroll_req = enroll_req
        self.meet_times = meet_times
        self.course_room = course_room
        self.prereq = prereq if prereq else []
    
    def add_prereq(self, prereq):
        """
        adds a prereq to the course
        """
        if prereq not in self.prereq:
            self.prereq.append(prereq)
    
    def update_meeting_time(self, day, time):
        """Updates the time on a specific day"""
        self.meet_times[day] = time

    def update_room(self, new_room):
        """updates the classroom location"""
        self.room = new_room
    
    