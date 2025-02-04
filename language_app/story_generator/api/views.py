import os
import random
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import google.generativeai as genai
from .story_data import *

load_dotenv()

@api_view(['POST'])
def generate_story(request):
    # generate story based on user input
    story_settings = request.data['story_settings']

    random_names = random.sample(all_japanese_names, 4)

    if story_settings['charactersName'] == '':
        character_name = random.choice(all_japanese_names)
    else:
        character_name = story_settings['charactersName']

    if story_settings['genre'] == 'Random':
        genre = random.sample(all_genres, 3)
    else:
        genre = story_settings['genre']
    
    random_theme = random.sample(general_themes, 3)

    random_starting_situation = random.sample(starting_situations, 3)

    if story_settings['length'] == 'Short':
        length = 75
    elif story_settings['length'] == 'Medium':
        length = 150
    elif story_settings['length'] == 'Long':
        length = 250

    gemini_api_key = os.getenv('GEMINI_API_KEY')

    genai.configure(api_key=gemini_api_key)

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction="You are only telling a story only in Japanese, no other languages will ever be used for any purpose.")
    

    print(genre, random_theme, random_names, random_starting_situation)
    prompt = f"""Generate a short story in Japanese for language learners at the JLPT {story_settings['difficulty']} level, 
                never go higher in difficulty than {story_settings['difficulty']}, use kanji, don't provide furigana.
                Please choose one genre from this list of genres: {genre}.
                Please choose one theme from this list of themes: {random_theme}.
                Please choose one starting situation from this list of starting situations: {random_starting_situation}. The story should start with the situation you choose.
                ensure that the genre, theme, and starting situation you choose are consistent with each other and work together to create a coherent and engaging short story.  
                The combination should make sense thematically and narratively, 
                but don't be afraid to choose potentially interesting or slightly unexpected combinations that could make the story more unique.
                Aim for approximately {length} words in length. 
                Please make the story engaging and interesting for a Japanese language learner, ensuring it's original and not repetitive.
                You must include {character_name} as a character in the story. Use name exactly. 
                If you want to include additional characters beyond {character_name}, 
                you can optionally use names from this list: {random_names}. Only add extra characters if it naturally fits the story and enhances engagement.  
                For very short stories, it's often best to keep the number of characters limited to maintain focus.
                When referring to characters, please use appropriate Japanese honorific suffixes after their names.
                Strive for natural and contextually reasonable honorific usage.
                Make names bolded everytime a name shows up. Please write the character's name in Kanji (if a standard Kanji representation exists), otherwise in Hiragana or Katakana.
                """
    print(prompt)

    response = model.generate_content(
        prompt,
        generation_config = genai.GenerationConfig(
            temperature=1.5,
        ))

    return Response({"status": "success", 'response': response.text}, status=status.HTTP_200_OK)
