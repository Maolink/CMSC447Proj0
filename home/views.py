from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from rest_framework import generics
from . models import *
from rest_framework.response import Response
from . serializers import *
# Create your views here.

# views take requests and return responses. request handler. 
# A view is usually something the user sees, but the template is actually that.

@api_view(['POST'])
def create_college_course(request):
    serializer = CollegeCourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CollegeCourseViewSet(viewsets.ModelViewSet):
    queryset = CollegeCourse.objects.all()
    serializer_class = CollegeCourseSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    @action(detail=True, methods=['get', 'post', 'delete'])
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
    
        if request.method == 'DELETE': 
            course_pkey = request.data.get('course')
            try:
                course = CollegeCourse.objects.get(pk = course_pkey)
            except CollegeCourse.DoesNotExist:
                return Respone({"detail": f"No course with that primary key"}, status=status.HTTP_404_NOT_FOUND)
            schedule.courses.remove(course)
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        queryset = schedule.courses.all()
        serializer = CollegeCourseSerializer(queryset, many=True)
        return Response(serializer.data)

def home_page(request):
    # academicPathway myAcademicPathway = academicPathway('','','','')

    #can pass things into the html page like our academic pathway, and other things.
    return render(request, 'home/home.html') # goes to template folder and then /home/home.html


