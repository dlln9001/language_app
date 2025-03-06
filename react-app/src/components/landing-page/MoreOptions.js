import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import GenreDropdown from "./GenreDropdown";

import { CiCircleInfo } from "react-icons/ci";


function MoreOptions() {
    const [kana, setKana] = useState('loading')
    const [showNameInfo, setShowNameInfo] = useState(false)
    const nameInfoRef = useRef(null)
    const [name, setName] = useState("")

    // Allows letters, numbers, spaces, hyphens, and apostrophes
    const NameWhitelist = /^[a-zA-Z0-9\s'-]+$/;

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        if (localStorage.getItem('storySettings')) {
            const settings = JSON.parse(localStorage.getItem('storySettings'))
            setName(settings.charactersName)
            setKana(settings.kana)
        }

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
            { kana !== 'loading' &&
            <>
                <div className=" mt-3 w-full">
                    <GenreDropdown />
                </div>

                <div className=" mt-3 w-full">
                    <p className=" text-sm mb-1 md:text-base">Read in Kana (no kanji)</p>

                    <div className={`transition ${kana ? `bg-teal-700` : `bg-stone-400`} duration-500 rounded-full p-1 w-12 flex cursor-pointer`} 
                        onClick={() => {
                            setKana(!kana)
                            let storySettings = JSON.parse(localStorage.getItem('storySettings'))
                            storySettings['kana'] = !kana
                            localStorage.setItem('storySettings', JSON.stringify(storySettings))
                            }}>
                        <div className={`h-5 w-5 rounded-full bg-stone-50 transition duration-500 ${kana ? ` translate-x-full` : `translate-x-0`}`}></div>
                    </div>
                    
                </div>
            </>
            }
        </div>
    )
}

export default MoreOptions