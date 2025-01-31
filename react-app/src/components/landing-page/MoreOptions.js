import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import GenreDropdown from "./GenreDropdown";
import { CiCircleInfo } from "react-icons/ci";


function MoreOptions() {
    const [furigana, setFurigana] = useState(true)
    const [showNameInfo, setShowNameInfo] = useState(false)
    const nameInfoRef = useRef(null)
    const [name, setName] = useState("")

    // Allows letters, numbers, spaces, hyphens, and apostrophes
    const NameWhitelist = /^[a-zA-Z0-9\s'-]+$/;

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    function handleDocumentClick(e) {
        if (nameInfoRef.current && !nameInfoRef.current.contains(e.target)) {
            setShowNameInfo(false)
        }
    }

    return (
        <div className="w-full">
            <div className=" mt-3 w-full">
                <GenreDropdown />
            </div>

            <div className=" mt-3 w-full">
                <p className=" text-sm mb-1 md:text-base">Main Characters Name</p>
                <div className="flex items-center gap-2 relative">
                    <div className="relative w-2/3">
                        <input type="text" placeholder="Enter name..." className="border border-slate-300 rounded-md text-sm px-2 py-1 w-full outline-none bg-stone-50 md:text-base"
                                value={name}
                                onChange={(e) => {
                                    if (e.target.value.length <= 25 && NameWhitelist.test(e.target.value) || e.target.value === "") {
                                        setName(e.target.value)
                                    }
                                }}/>
                        {name.length === 25 &&
                            <p className="absolute text-xs right-0 text-red-500">Name too long</p>
                        }
                    </div>

                    <div className=" text-lg cursor-pointer" 
                        onClick={() => setShowNameInfo(!showNameInfo)} 
                        ref={nameInfoRef}
                        >
                        <CiCircleInfo />
                    </div>

                    {showNameInfo &&
                        <div className=" bg-slate-800 text-stone-50 rounded-md p-2 absolute top-8 right-0 z-10">
                            <p className=" text-xs">The main character's name will be used in the story</p>
                        </div>
                    }
                </div>
            </div>

            <div className=" mt-3 w-full">
                <p className=" text-sm mb-1 md:text-base">Furigana</p>
                <div className={`transition ${furigana ? `bg-teal-700` : `bg-stone-400`} duration-500 rounded-full p-1 w-12 flex cursor-pointer`} 
                    onClick={() => setFurigana(!furigana)}>
                    <div className={`h-5 w-5 rounded-full bg-stone-50 transition duration-500 ${furigana ? ` translate-x-full` : `translate-x-0`}`}></div>
                </div>
            </div>

        </div>
    )
}

export default MoreOptions