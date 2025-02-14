import { useState } from "react";
import { useEffect } from "react";

import DOMPurify from 'dompurify';
import { marked } from 'marked';

import MoreOptions from "./MoreOptions";
import DifficultyOptions from "./DifficultyOptions";
import LengthOptions from "./LengthOptions";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { HiMiniSpeakerWave } from "react-icons/hi2";


export function setSettings(level, type, setDifficulty, setLength) {
    const settings = JSON.parse(localStorage.getItem('storySettings'))
    settings[type] = level
    localStorage.setItem('storySettings', JSON.stringify(settings))
    if (type === "difficulty") {
        setDifficulty(level)
    }
    else if (type === "length") { 
        setLength(level)
    }
}

function LandingPage() {
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [difficulty, setDifficulty] = useState("")
    const [length, setLength] = useState("")
    const [response, setResponse] = useState("こんにちは！")
    const [loadingPrompt, setLoadingPrompt] = useState(false)

    const [audioURL, setAudioURL] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)

    const levels = ["PRE-N5 (~300-500 most common words)", "N5", "N4"]

    useEffect(() => {
        if (!localStorage.getItem('storySettings')) {
            // all default settings
            localStorage.setItem('storySettings', JSON.stringify({difficulty: levels[0], length: "Short", genre: "Random", charactersName: "", kana: false}))
            setDifficulty(levels[0])
            setLength("Short")
        }
        else {
            const settings = JSON.parse(localStorage.getItem('storySettings'))
            setDifficulty(settings.difficulty)
            setLength(settings.length)
        }
    }, [])


    function generateStory() {

        setResponse('')
        setLoadingPrompt(true)
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/story-generator/generate-story/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                story_settings: JSON.parse(localStorage.getItem('storySettings'))
            })
        })
        .then(res => res.json())
        .then(data => {
            setLoadingPrompt(false)
            let parsed_response = marked.parse(data.response)
            const clean_response = DOMPurify.sanitize(parsed_response)
            setResponse(clean_response)
            console.log(clean_response)
        })
    }

    function extractTextFromHTML(htmlString) {
        const tempElement = document.createElement('div'); // Create a temporary div
        tempElement.innerHTML = htmlString;             // Set the HTML content
        return tempElement.textContent || tempElement.innerText || ""; // Get textContent or innerText
    }


    function generateAudio() {

        const plainText = extractTextFromHTML(response) // 'response' has html tags, so need to remove them first

        fetch(`${process.env.REACT_APP_API_BASE_URL}/story-generator/generate-audio/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: plainText
            })
        })
        .then(res => {
            if (res.status !== 200) { 
                throw new Error(`error!`);
            }
            return res.blob(); // Get the response body as a Blob
        })
        .then(blob => {
            const url = URL.createObjectURL(blob); // Create URL from Blob
            setAudioURL(url) // Set the audio URL state
            setIsPlaying(true)
        })
        .catch(error => { 
            console.error("Error generating audio:", error);
        });
    }

    
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 m-2 self-start">
                <img src="/images/logos/main-logo.png" alt="" className="w-20 h-20"/>
                <p className=" text-2xl">StoryLingoAI</p>
            </div>

            <hr className=" border-teal-700 w-full"/>

            <p className="text-xs md:text-lg bg-teal-700 text-stone-50 w-full text-center py-2 px-3">
                StoryLingoAI is currently in Beta. You may encounter bugs or unfinished features. 
                Thank you for helping us test and improve! Please send feedback to storylingoai@gmail.com</p>

            <div className="flex flex-col items-center mt-8 md:mt-10 md:w-[450px] mx-8 w-fit">
                <h1 className=" font-bold text-xl md:text-3xl whitespace-nowrap">Personalized Japanese Stories</h1>

                <p className=" text-center mt-3 text-sm md:text-xl">Learn Japanese with personalized stories. Select your level, generate a story, and read in Japanese</p>

                <div className="mt-3 w-full flex flex-col items-center gap-2 md:mt-8">
                    <p className=" font-semibold md:text-lg">Difficulty</p>

                    <DifficultyOptions 
                        difficulty={difficulty} 
                        setDifficulty={setDifficulty} 
                        levels={levels} 
                        setLength={setLength}/>

                </div>

                <div className="mt-3 w-full flex flex-col items-center gap-2">
                    <p className=" font-semibold md:text-lg">Length</p>

                    <LengthOptions
                        setDifficulty={setDifficulty}
                        length={length}
                        setLength={setLength}/>

                </div>
                
                <div className="self-start w-full">
                    <div className="flex items-center gap-2 mt-4 md:text-lg hover:cursor-pointer w-fit" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                        <p>More options</p> 
                        {showMoreOptions
                        ? <IoIosArrowUp />
                        : <IoIosArrowDown />
                        }
                    </div>

                    {showMoreOptions && <MoreOptions />}

                </div>

                <button className="mt-12 self-start">
                    <div className={`text-xl md:text-2xl ${isPlaying ? 'text-teal-700' : 'text-stone-600'}`} onClick={() =>{
                        if (isPlaying) {
                            setIsPlaying(false)
                        }
                        else if (audioURL) {
                            setIsPlaying(true)
                        }
                        else {
                            generateAudio()
                        }
                        }}>
                        <HiMiniSpeakerWave />
                    </div>
                    {(audioURL && isPlaying) &&
                        <div>
                            <audio src={audioURL} type="audio/mpeg" autoPlay onEnded={() => setIsPlaying(false)}></audio>
                        </div>

                    }
                </button>

                <button 
                    className="bg-teal-700 text-stone-50 rounded-md w-full py-1 md:py-2 md:mt-6 mt-4 md:text-lg font-semibold hover:bg-teal-800"
                    onClick={() => {
                        generateStory()
                        setAudioURL('')
                    }}>
                        Generate Story
                </button>

                
                <p 
                    className=" bg-stone-50 self-start mt-4 text-lg md:text-2xl w-full h-full mb-28"
                    dangerouslySetInnerHTML={{__html: response}}>
                        
                </p>
                
                {loadingPrompt && 
                    <div role="status">
                        <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-300 fill-teal-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                }

            </div>
        </div>
    )
}

export default LandingPage