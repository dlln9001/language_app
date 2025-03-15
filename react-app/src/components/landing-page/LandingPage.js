import { useState, useEffect } from "react";

import MoreOptions from "./option-types/MoreOptions";
import DifficultyOptions from "./option-types/DifficultyOptions";
import LengthOptions from "./option-types/LengthOptions";
import StoryGeneration from "../story-generation/StoryGeneration";
import MenuOptions from "../menu-options/MenuOptions";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";


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

    const levels = ["PRE-N5 (~300-500 most common words)", "N5", "N4"]
    const defaultStorySettings = {
        difficulty: levels[0], length: "Short", genre: "Random",
        kana: false, wordsToLearn: [], characters: []
    }


    useEffect(() => {
        if (!localStorage.getItem('storySettings')) {
            // all default settings
            localStorage.setItem('storySettings', JSON.stringify(defaultStorySettings))

            setDifficulty(levels[0])
            setLength("Short")
        }
        else {
            let settings = JSON.parse(localStorage.getItem('storySettings'))

            if (Object.keys(settings).length !== Object.keys(defaultStorySettings).length) {
                localStorage.setItem('storySettings', JSON.stringify(defaultStorySettings))
                settings = defaultStorySettings
            }

            setDifficulty(settings.difficulty)
            setLength(settings.length)
        }
    }, [])


    return (
        <div className="flex flex-col items-center overflow-x-hidden">
            <div className="flex items-center gap-3 m-2 self-start w-full">
                <img src="/images/logos/main-logo.png" alt="" className="w-16 h-16 md:w-20 md:h-20" />
                <p className=" text-xl md:text-2xl">StoryLingoAI</p>
                <MenuOptions />
            </div>

            <hr className=" border-teal-700 w-full" />

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
                        setLength={setLength} />

                </div>

                <div className="mt-3 w-full flex flex-col items-center gap-2">
                    <p className=" font-semibold md:text-lg">Length</p>

                    <LengthOptions
                        setDifficulty={setDifficulty}
                        length={length}
                        setLength={setLength} />

                </div>

                <div className="self-start w-full">
                    <div
                        id="show-more-options-id"
                        className="flex items-center gap-2 mt-4 md:text-lg hover:cursor-pointer w-fit" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                        <p>More options</p>
                        {showMoreOptions
                            ? <IoIosArrowUp />
                            : <IoIosArrowDown />
                        }
                    </div>

                    {showMoreOptions && <MoreOptions />}

                </div>

                <StoryGeneration />

            </div>
        </div>
    )
}

export default LandingPage