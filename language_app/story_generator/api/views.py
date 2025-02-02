import os
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import google.generativeai as genai

load_dotenv()

@api_view(['POST'])
def generate_story(request):
    # generate story based on user input
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Explain how AI works")
    return Response({"status": "success", 'response': response.text}, status=status.HTTP_200_OK)
