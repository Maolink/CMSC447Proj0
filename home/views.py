from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
# Create your views here.

# views take requests and return responses. request handler. 
# A view is usually something the user sees, but the template is actually that.

class ReactView(APIView):
    serializer_instance = ReactSerializer
    
    def get(self, request):
        # api get response.
        objects = [{
            "name": "detail.name",
            "course_id": "detail.course_id",
            "description": "detail.description",
            "enrollment_requirements": "detail.enrollment_requirements",
            "meeting_times": "detail.meeting_times",
            "room": "detail.room",
            "prerequisites": "detail.prerequisites"
        }
        for object in CollegeCourse.objects.all()]
        return Response(objects)


    def post(self, request):
        serializer = ReactSerializer(data = request.data)
        if serializer.is_valid(raise_execption=True):
            serializer.save()
            return Response(serializer.data)




def home_page(request):
    # academicPathway myAcademicPathway = academicPathway('','','','')

    #can pass things into the html page like our academic pathway, and other things.
    return render(request, 'home/home.html') # goes to template folder and then /home/home.html


