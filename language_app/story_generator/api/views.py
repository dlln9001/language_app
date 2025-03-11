import os
import random
import json
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import StreamingHttpResponse
from django.http import FileResponse
from rest_framework import status

from google import genai
from google.genai import types
from gtts import gTTS
import io

from .story_data import *
# from .blacklist import blacklist

load_dotenv()

kana_prompt = 'use only kana (hiragana or katakana) for all words, do NOT ever use any kanji at all.'
kanji_prompt = """use kanji, do NOT provide furigana. 
                And DO NOT EVER provide the hiragana in parenthesis after the kanji. The text you produce goes through a tts, and it will repeat the words.
                Example of Desired Output (Correct - NO Furigana):
                広い台所で、青いリボンがついた鍵を見つけました。それはとてもきれいでした。
                Example of Incorrect Output (AVOID this - Furigana is NOT wanted):
                広（ひろ）い台所（だいどころ）で、青（あお）いリボンがついた鍵（かぎ）を見（み）つけました。 <-- DO NOT DO THIS!"""

offer_options_prompt = """At the end of the story, in English, offer the user 2 choices for how the story could continue, 
                        and ask them to choose one of the options to continue the story.
                        Please generate the output in the following exact and crucial format, using '%%%%' as a delimiter between each and every part.  The format is:
                        `[Japanese Story Segment] %%%% [Question - specifically (for example) "What happens next?"] %%%% [Choice A] %%%% [Choice B] %%%%`
                        It is absolutely essential that you use '%%%%' to separate each of these four parts.
                        For example:
                        `紙には何も書いてありませんでした。Yokoはどうしますか。%%%% What happens next? %%%% Yoko searches the park hoping to discover who the note came from. 
                        %%%% Yoko decides to ask Daijiro about it as he often works in the park's administration office.`"""

def words_to_learn_func(words_to_learn):
    words_to_learn_prompt = f"""Please try your best to include the following japanese words in the story: {words_to_learn} 
                            (even if they may be harder than the indicated difficulty). If a word is not japanese, do not use it."""
    return words_to_learn_prompt

def characters_func(created_characters):
    random_names = random.sample(all_japanese_names, 4)

    if created_characters:
        characters_prompt = f"""Use these characters in the story, each character has a name, along with some traits: {created_characters}. 
                        Use name exactly, if it's in romaji, use romaji, if it's katakana use katakana, etc. 
                        If you want to include additional characters beyond {created_characters} (like if there's not enough characters), 
                        You can optionally use names from this list: {random_names}. Only add extra characters if it naturally fits the story and enhances engagement.  
                        For very short stories, it's often best to keep the number of characters limited to maintain focus."""
    else:
        characters_prompt = f"""For characters, you can use names from this list if you need ideas: {random_names}. 
                                Only add extra characters if it naturally fits the story and enhances engagement.  
                                For very short stories, it's often best to keep the number of characters limited to maintain focus."""
    
    characters_prompt += """ If new characters are added to the story, 
                            please introduce them in a way that makes it clear who they are and how they relate to the main character.
                            When referring to characters, please use appropriate Japanese honorific suffixes after their names, but NEVER use kanji for these suffixes, 
                            only use hiragana for them. For example, using さん or くん and not 君. 
                            Strive for natural and contextually reasonable honorific usage.
                            Make names bolded everytime a name shows up. Do not use any kanji for character names."""
    
    return characters_prompt

@api_view(['POST'])
def generate_story(request):
    # generate story based on user input
    story_settings = request.data['story_settings']

    # choose characters
    created_characters = story_settings['characters']
    characters_prompt = characters_func(created_characters)

    # get words to learn
    if story_settings['wordsToLearn']:
        words_to_learn = story_settings['wordsToLearn']
        words_to_learn_prompt = words_to_learn_func(words_to_learn)
    else:
        words_to_learn_prompt = ''

    # choose kana or kanji
    if story_settings['kana']:
        kana_or_kanji = kana_prompt
    else:
        kana_or_kanji = kanji_prompt

    # choose genre, theme, starting situation, location
    if story_settings['genre'] == 'Random':
        genre = random.sample(all_genres, 3)
    else:
        genre = story_settings['genre']

    random_theme = random.sample(general_themes, 3)

    random_starting_situation = random.sample(starting_situations, 3)

    random_locations = random.sample(story_settings_locations, 3)

    # get length of story
    if story_settings['length'] == 'Short':
        length = 75
    elif story_settings['length'] == 'Medium':
        length = 150
    elif story_settings['length'] == 'Long':
        length = 250

    gemini_api_key = os.getenv('GEMINI_API_KEY')

    client = genai.Client(api_key=gemini_api_key)
    
    instructions = """You are only telling a story only in Japanese, no other languages will ever be used for the story, 
                    do not translate it. Also, at the very start of your response please generate the following in English to help 
                    Japanese language learners understand the story:
                    1. A short, clear title in English to indicate the story's topic and genre you chose.
                    2. A brief (1-2 sentence) introductory paragraph in English to provide essential context and set the scene for beginner learners, 
                    but do not ever mention the starting situation.
                    Separate this context your providing at the start and the japanese story with the marker "%%%%". This is essential.
                    """
    
    print(characters_prompt, 'asd;lfkjlkj')
        
    # print(genre, random_theme, random_names, random_starting_situation, random_locations)
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

                {characters_prompt} 

                {words_to_learn_prompt} Make sure to break up the story into small paragraphs to make it easier to read.
                The user can also choose to continue the story if they would like to, so make sure to leave the story open-ended.

                {offer_options_prompt}
                """
    # print(prompt)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=instructions,
            temperature=1.5,),
        contents=[prompt],
    )
    
    return Response({"status": "success", 'response': response.text}, status=status.HTTP_200_OK)


@api_view(['POST'])
def continue_story(request):
    option_selected = request.data['option_selected']
    whole_story = request.data['raw_response']
    story_settings = request.data['story_settings']

    # choose characters
    created_characters = story_settings['characters']
    characters_prompt = characters_func(created_characters)

    # get words to learn
    if story_settings['wordsToLearn']:
        words_to_learn = story_settings['wordsToLearn']
        words_to_learn_prompt = words_to_learn_func(words_to_learn)
    else:
        words_to_learn_prompt = ''

    # choose kana or kanji
    if story_settings['kana']:
        kana_or_kanji = kana_prompt
    else:
        kana_or_kanji = kanji_prompt

    # get length of story
    if story_settings['length'] == 'Short':
        length = 75
    elif story_settings['length'] == 'Medium':
        length = 150
    elif story_settings['length'] == 'Long':
        length = 250



    gemini_api_key = os.getenv('GEMINI_API_KEY')

    client = genai.Client(api_key=gemini_api_key)

    instructions = """You are only telling a story only in Japanese, no other languages will ever be used for the story, 
                        do not translate it, do not provide any English context at the start of the story. Continue the story from where it left off."""

    prompt_continue = f"""Continue the story from where it left off. This is the story you will be continuing: {whole_story}. 
                        The user had the option to choose between two choices to change the story, and this is what they chose to what will happen next: {option_selected}.
                        Aim for approximately {length} words in length.
                        {kana_or_kanji} {characters_prompt} {words_to_learn_prompt} 
                        
                        Make sure to break up the story into small paragraphs to make it easier to read.
                        The user can also choose to continue the story if they would like to, so make sure to leave the story open-ended.
                        
                        {offer_options_prompt} Do not put the '%%%%' marker anywhere else in the story. Only those four parts"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=instructions,
            temperature=1.5,),
        contents=[prompt_continue],
    )


    return Response({"status": "success", 'response': response.text}, status=status.HTTP_200_OK)


@api_view(['POST'])
def generate_audio(request):
    text = request.data.get('text')  # Get text from request body

    if not text:
        return Response({'status': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        tts = gTTS(text=text, lang='ja')

        audio_stream = tts.stream() # Directly use gTTS stream generator

        response = StreamingHttpResponse(
            audio_stream, # Pass the gTTS stream generator directly
            content_type='audio/mpeg'
        )
        response['Content-Disposition'] = 'inline; filename="speech_stream.mp3"'
        return response

    except Exception as e:
        return Response({'status': f'Error generating audio'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)