from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

# views take requests and return responses. request handler. 
# A view is usually something the user sees, but the template is actually that.

def home_page(request):
    # academicPathway myAcademicPathway = academicPathway('','','','')

    #can pass things into the html page like our academic pathway, and other things.
    return render(request, 'home/home.html') # goes to template folder and then /home/home.html


