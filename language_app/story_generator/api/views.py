import os
import random
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import google.generativeai as genai
from .story_data import *
# from .blacklist import blacklist

load_dotenv()

@api_view(['POST'])
def generate_story(request):
    # generate story based on user input
    story_settings = request.data['story_settings']

    random_names = random.sample(all_japanese_names, 4)

    if story_settings['kana']:
        kana_or_kanji = 'use only kana (hiragana or katakana) for all words, do not use any kanji at all. Even for names'
    else:
        kana_or_kanji = "use kanji, don't provide furigana. Remember different difficulty levels have different kanji requirements"

    # if story_settings['charactersName'].lower() in blacklist:
    #     character_name = 'John Doe'
    
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

    random_locations = random.sample(story_settings_locations, 3)

    if story_settings['length'] == 'Short':
        length = 75
    elif story_settings['length'] == 'Medium':
        length = 150
    elif story_settings['length'] == 'Long':
        length = 250

    gemini_api_key = os.getenv('GEMINI_API_KEY')

    genai.configure(api_key=gemini_api_key)

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction="""You are only telling a story only in Japanese, no other languages will ever be used for any purpose, 
                              do not translate it. Only output the story, nothing else, not even the settings you choose. Only the story itself.""")
        
        
    print(genre, random_theme, random_names, random_starting_situation, random_locations)
    prompt = f"""Generate a short story in Japanese for language learners at the JLPT {story_settings['difficulty']} level, 
                never go higher in difficulty than {story_settings['difficulty']}, {kana_or_kanji}.
                Please choose one genre from this list of genres: {genre}.
                Please choose one theme from this list of themes: {random_theme}.
                Please choose one location from this list of locations: {random_locations}.
                Please choose one starting situation from this list of starting situations: {random_starting_situation}. The story should start with the situation you choose.
                Ensure that the genre, theme, location, and starting situation you choose are consistent with each other and work together to create a coherent and engaging short story.  
                The combination you will choose should make sense thematically, narratively, and fit with the correct difficulty level, 
                but don't be afraid to choose potentially interesting or slightly unexpected combinations that could make the story more unique.
                Aim for approximately {length} words in length. 
                Please make the story engaging and interesting for a Japanese language learner, ensuring it's original and not repetitive.
                You must include {character_name} as a character in the story. Use name exactly. 
                If you want to include additional characters beyond {character_name}, 
                You can optionally use names from this list: {random_names}. Only add extra characters if it naturally fits the story and enhances engagement.  
                For very short stories, it's often best to keep the number of characters limited to maintain focus. If new characters are added to the story, 
                please introduce them in a way that makes it clear who they are and how they relate to the main character.
                When referring to characters, please use appropriate Japanese honorific suffixes after their names.
                Strive for natural and contextually reasonable honorific usage.
                Make names bolded everytime a name shows up. Please write the character's name in hiragana, do not use kanji for names.
                Again, please only provide the Japanese story text, and do not include any genre, theme, location, 
                or other descriptive information before or after the story. Just the story text in Japanese
                """
    print(prompt)

    response = model.generate_content(
        prompt,
        generation_config = genai.GenerationConfig(
            temperature=1.5,
        ))

    return Response({"status": "success", 'response': response.text}, status=status.HTTP_200_OK)


@api_view(['POST'])
def generate_audio(request):
    print(request.data)
    return Response({"status": "success"}, status=status.HTTP_200_OK)