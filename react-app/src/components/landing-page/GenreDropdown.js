import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import { IoIosArrowDown } from "react-icons/io";


function GenreDropdown() {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const [genre, setGenre] = useState("")

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        if(localStorage.getItem('storySettings')) {
            const settings = JSON.parse(localStorage.getItem('storySettings'))
            setGenre(settings.genre)
        }

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    })

    function handleDocumentClick(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false)
        }
    }

    function setGenreSettings(genre) {
        const settings = JSON.parse(localStorage.getItem('storySettings'))
        settings['genre'] = genre
        localStorage.setItem('storySettings', JSON.stringify(settings))
        setGenre(genre)
    }

    return (
        <>
                <p className=" text-sm mb-1 md:text-base" id="select-genre-id">Select Genre</p>
                <div className="w-2/3 relative">
                    <div 
                        className="border border-slate-300 rounded-md text-sm px-2 py-1 flex items-center md:text-base cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                        ref={dropdownRef}
                        id="genre-button-id">
                        <p>{genre}</p>
                        <div className=" ml-auto mr-2">
                            <IoIosArrowDown />
                        </div>
                    </div>
                    {showDropdown &&
                        <div className="absolute bg-stone-50 border border-slate-300 mt-1 w-full rounded-md z-10 shadow-xl" id="genre-dropdown-id">
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer rounded-t-md" onClick={() => setGenreSettings('Random')}>Random</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer" onClick={() => setGenreSettings('Slice of Life')}>Slice of Life</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer" onClick={() => setGenreSettings('Adventure')}>Adventure</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer" onClick={() => setGenreSettings('Silly')}>Silly</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer rounded-b-md" onClick={() => setGenreSettings('Mystery')} id="mystery-genre-id">Mystery</p>
                        </div>
                    }
                </div>
        </>
    )
}

export default GenreDropdown