import os
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import google.generativeai as genai
import random

load_dotenv()

@api_view(['POST'])
def generate_story(request):
    # generate story based on user input
    story_settings = request.data['story_settings']

    all_genres = ['Slice of Life', 'Adventure', 'Silly', 'Comedy', 'Mystery', 'Food', 'Travel', 'Animals']

    general_themes = [
    'Friendship', 'Discovery', 'Challenge', 'Everyday life', 'Problem solving',
    'Nature', 'Food adventure', 'Travel mishap', 'Unexpected event', 'Learning something new',
    'Helping others', 'A funny misunderstanding', 'A small town secret', 'Magical encounter',
    'Time travel (simple)', 'Robot friend', 'Talking animal', 'Delicious food', 'Beautiful scenery',
    'Kindness', 'Bravery', 'Curiosity', 'Sharing', 'Patience', 'Gratitude', 'Teamwork',
    'Honesty', 'Responsibility', 'Creativity', 'Excitement', 'Relaxation', 'Celebration',
    'Surprise', 'Growth', 'Helpfulness', 'Politeness', 'Fun', 'Comfort', 'Home', 'Memories',
    'Tradition', 'Local Culture', 'Seasons (General Sense)', 'Weather (General Sense)',
    'Travel (General Sense)', 'Food (General Sense)', 'Music (General Sense)', 'Art (General Sense)',
    'Games (General Sense)', 'Learning', 'Making Mistakes (and Learning from them)',
    'Overcoming Obstacles', 'Simple Pleasures',

    # --- Specific Themes ---
    'Making a New Friend', 'Exploring a New Shop', 'Going to a Festival Game', 'Trying a New Japanese Snack', 'Visiting a Local Park Festival (Simplified)',
    'Seeing Street Performers (Simple)', 'Helping an Elderly Person (Simple Act)', 'Getting Lost and Finding the Way Back (Simplified)', 'Sharing Lunch with Classmates',
    'Exchanging Small Gifts with Friends', "Autumn Leaves in Japan", "Cherry Blossoms", "Summer Fireworks", "Winter Illuminations in Japan",
    ]

    all_japanese_names = [
        "Aiba", "Aika", "Aki", "Akihito", "Akihiro", "Akira", "Akari", "Akatsuki", "Akane", "Amato",
        "Amane", "Ami", "An", "Ao", "Aoi", "Arashi", "Arata", "Asahi", "Asuka", "Atsuki", "Ayumu",
        "Beniko", "Botan", "Chiaki", "Chiharu", "Chikao", "Chinatsu", "Chihiro", "Chou", "Daigo",
        "Daichi", "Daijiro", "Daiki", "Den", "Eiji", "Eito", "Ena", "Erika", "Fuji", "Fuuta", "Gaku",
        "Genki", "Gin", "Ginga", "Goro", "Haku", "Hajime", "Haru", "Haruna", "Hayao", "Hayate",
        "Hazuki", "Hibiki", "Hideki", "Hideo", "Hikaru", "Hina", "Hinata", "Hiroki", "Hiroshi", "Hiroto",
        "Hiyo", "Homare", "Honami", "Honoka", "Hoshi", "Hotaka", "Hotaru", "Ibuki", "Ikkaku", "Inori",
        "Issei", "Itsuki", "Izumi", "Jin", "Jiro", "Jo", "Jouji", "Jun", "Junna", "Junpei", "Kaede",
        "Kaguya", "Kai", "Kaito", "Kakeru", "Kana", "Kanae", "Kanako", "Kanon", "Kanata", "Kanna",
        "Kaori", "Karin", "Kasumi", "Katsumi", "Kaoru", "Kazane", "Kazuhiko", "Kazuki", "Kazuma", "Kazumi",
        "Keigo", "Keiko", "Keisuke", "Keita", "Keito", "Ken", "Kenichi", "Kenji", "Kenshin", "Kenta",
        "Kira", "Kiyoka", "Kiyomasa", "Kiyomi", "Kiyora", "Kiyoshi", "Kokoa", "Koharu", "Koki", "Komugi",
        "Konatsu", "Kota", "Kotone", "Kotomi", "Kou", "Kouhei", "Kouki", "Kouta", "Kouya", "Luna",
        "Madoka", "Maho", "Mai", "Makoto", "Mamoru", "Manabu", "Manami", "Mao", "Marina", "Marin",
        "Masaki", "Masaru", "Masato", "Masayoshi", "Mayu", "Mei", "Michio", "Miharu", "Miki", "Miku",
        "Mina", "Minami", "Minato", "Minori", "Mio", "Miori", "Mitsu", "Mitsuki", "Miyu", "Mizuki",
        "Mizuho", "Moe", "Momiji", "Momoka", "Mutsuki", "Nagi", "Nagisa", "Nao", "Naohiro", "Naoki",
        "Naoto", "Nanami", "Natsuki", "Natsume", "Nene", "Niko", "Noboru", "Nobukazu", "Nonoka", "Nozomi",
        "Oka", "Osamu", "Rai", "Raiden", "Raiga", "Raito", "Raizo", "Raku", "Ramu", "Ran", "Ranji",
        "Rei", "Reiji", "Reina", "Remi", "Ren", "Renka", "Renji", "Riku", "Rikuo", "Rin", "Rina",
        "Rinon", "Rintaro", "Riona", "Ririka", "Risa", "Ritsu", "Rumi", "Runo", "Ruri", "Ruriha",
        "Ryoga", "Ryohei", "Ryouma", "Ryota", "Ryosei", "Ryusei", "Saburo", "Sachiko", "Saku", "Sakura",
        "Sakuyo", "Sanosuke", "Sango", "Sara", "Saki", "Sakuyo", "Sanosuke", "Sango", "Sara", "Saki",
        "Satoshi", "Satsuki", "Sayaka", "Seiji", "Sen", "Senichi", "Serina", "Setsuka", "Setsuna", "Shin",
        "Shinji", "Shion", "Shiori", "Shizuka", "Shogo", "Sho", "Shota", "Shun", "Shunya", "Sohma",
        "Sora", "Sota", "Sou", "Souma", "Subaru", "Suisei", "Sumire", "Sumireko", "Susumu", "Suzuka",
        "Taichi", "Taiga", "Taiyo", "Takashi", "Takumi", "Taku", "Takeshi", "Takeru", "Taro", "Tatsuya",
        "Tetsuya", "Toki", "Toma", "Tomoe", "Tomoki", "Tomomi", "Tomoya", "Toru", "Tsubaki", "Tsubasa",
        "Tsukasa", "Tsukiyo", "Tsumugi", "Tsuyu", "Tsuyoshi", "Ukyo", "Umi", "Utae", "Wakaba", "Wakana",
        "Wataru", "Yamato", "Yasuhiro", "Yae", "Yo", "Yoichi", "Yoko", "Yori", "Yosei", "Yoshiaki",
        "Yoshihiro", "Yoshiko", "Yoshio", "Youko", "Yuichi", "Yuito", "Yuuka", "Yuuki", "Yuukihiro", "Yukihito",
        "Yukiho", "Yukio", "Yuna", "Yuumi", "Yuu", "Yuuka", "Yuumi", "Yuusei", "Yuzuki", "Yuzuha", "Yuzuyu",
        "Yurara", "Yurika", "Yuto", "Yuuya", "Zen", "Zenjiro", "Zin", "Zoe"
    ]

    random_names = random.sample(all_japanese_names, 4)

    if story_settings['genre'] == 'Random':
        genre = random.choice(all_genres)
    else:
        genre = story_settings['genre']
    
    random_theme = random.choice(general_themes)

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
    

    print(genre, random_theme, random_names)
    prompt = f"""Generate a short story in Japanese for language learners at the JLPT {story_settings['difficulty']} level, 
                never go higher in difficulty than {story_settings['difficulty']}, use kanji, don't provide furigana.
                The story should be in the {genre} genre and focus on the theme of {random_theme}.
                Aim for approximately {length} words in length. 
                Please make the story engaging and interesting for a Japanese language learner, ensuring it's original and not repetitive.
                You must include {story_settings['charactersName']} as a character in the story. Use name exactly. 
                If no name was provided or if you want to add more characters, use the following names: {random_names}. 
                Make names bolded everytime a name shows up. Please write the character's name in Kanji (if a standard Kanji representation exists), otherwise in Hiragana or Katakana
                """
    print(prompt)

    response = model.generate_content(
        prompt,
        generation_config = genai.GenerationConfig(
            temperature=1.5,
        ))

    return Response({"status": "success", 'response': response.text}, status=status.HTTP_200_OK)
