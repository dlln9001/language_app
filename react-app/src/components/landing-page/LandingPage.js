import { useState } from "react";
import MoreOptions from "./MoreOptions";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";


function LandingPage() {
    const [showMoreOptions, setShowMoreOptions] = useState(false)

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 m-2 self-start">
                <img src="/images/logos/main-logo.png" alt="" className="w-20 h-20"/>
                <p className=" text-2xl">StoryLingoAI</p>
            </div>

            <hr className=" border-teal-700 w-full"/>

            <div className="flex flex-col items-center mt-4 md:mt-10 mx-8 w-fit">
                <h1 className=" font-bold text-xl md:text-3xl">Personalized Japanese Stories</h1>

                <p className=" text-center mt-3 text-sm md:text-xl">Learn Japanese with personalized stories. Select your level, generate a story, and read in Japanese</p>

                <div className="mt-3 w-full flex flex-col items-center gap-2">
                    <p className=" font-semibold md:text-lg">Difficulty</p>
                    <div className="border-2 border-teal-600 rounded-md w-full h-8 md:h-10 text-xs md:text-base text-teal-700 flex">
                        <button className="border-2 border-y-0 border-transparent border-r-teal-600 h-full w-1/3 hover:bg-stone-100 rounded-l-md">Entry (N5)</button>
                        <button className="border-2 border-y-0 border-transparent border-r-teal-600 h-full w-1/3 hover:bg-stone-100">Beginner (N4)</button>
                        <button className="w-1/3 hover:bg-stone-100 rounded-r-md">Intermediate (N3)</button>
                    </div>
                </div>

                <div className="mt-3 w-full flex flex-col items-center gap-2">
                    <p className=" font-semibold md:text-lg">Length</p>
                    <div className="border-2 border-teal-600 rounded-md w-full h-8 md:h-10 text-xs md:text-base text-teal-700 flex">
                        <button className="border-2 border-y-0 border-transparent border-r-teal-600 h-full w-1/3 hover:bg-stone-100 rounded-l-md">Short</button>
                        <button className="border-2 border-y-0 border-transparent border-r-teal-600 h-full w-1/3 hover:bg-stone-100">Medium</button>
                        <button className="w-1/3 hover:bg-stone-100 rounded-r-md">Long</button>
                    </div>
                </div>
                
                <div className="self-start w-full">
                    <div className="flex items-center gap-2 mt-4 md:text-lg hover:cursor-pointer" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                        <p>More options</p> 
                        {showMoreOptions
                        ? <IoIosArrowUp />
                        : <IoIosArrowDown />
                        }
                    </div>

                    {showMoreOptions && <MoreOptions />}

                </div>

                <button className="bg-teal-700 text-stone-50 rounded-md w-full py-1 md:py-2 md:text-lg mt-10 font-semibold hover:bg-teal-800">Generate Story</button>

                <p className=" bg-stone-50 self-start mt-4 text-lg md:text-2xl w-full h-full mb-24">こんにちは！</p>
            </div>
        </div> 
    )
}

export default LandingPage