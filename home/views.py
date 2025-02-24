from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

# views take requests and return responses. request handler. 
# A view is usually something the user sees, but the template is actually that.

def home(request):
    return HttpResponse('hello there i am in your website')


