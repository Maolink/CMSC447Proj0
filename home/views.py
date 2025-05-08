from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework import generics
from . models import *
from rest_framework.response import Response
from . serializers import *
# Create your views here.

# views take requests and return responses. request handler. 
# A view is usually something the user sees, but the template is actually that.


class CollegeCourseViewSet(viewsets.ModelViewSet):
    queryset = CollegeCourse.objects.all()
    serializer_class = CollegeCourseSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    @action(detail=True, methods=['get', 'post'])
    def courses(self, request, pk=None):
        schedule = self.get_object()

        if request.method == 'POST':
            coursepkey = request.data.get('course') # expected value is {course: <pkey>}
            try:
                course = CollegeCourse.objects.get(pk=coursepkey)
            except CollegeCourse.DoesNotExist:  
                return Response(status=status.HTTP_404_NOT_FOUND)
            schedule.courses.add(course)
            return Response(status=status.HTTP_201_CREATED)

        queryset = schedule.courses.all()
        serializer = CollegeCourseSerializer(queryset, many=True)
        return Response(serializer.data)


# class ReactView(generics.ListCreateAPIView):
#     queryset = CollegeCourse.objects.all()
#     serializer_class = CollegeCourseSerializer
    
#     def get(self, request):
#         # api get response.
#         objects = [{
#             "name": objects.name,
#             "course_id": objects.course_id,
#             "description": objects.description,
#             "enrollment_requirements": objects.enrollment_requirements,
#             "meeting_times": objects.meeting_times,
#             "room": objects.room,
#             "prerequisites": objects.prerequisites
#         }
#         for objects in CollegeCourse.objects.all()]
#         return Response(objects)


#     def post(self, request):
#         serializer = self.serializer_class(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)




def home_page(request):
    # academicPathway myAcademicPathway = academicPathway('','','','')

    #can pass things into the html page like our academic pathway, and other things.
    return render(request, 'home/home.html') # goes to template folder and then /home/home.html


