import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

function GenreDropdown() {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const [genre, setGenre] = useState("Random")

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    })

    function handleDocumentClick(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false)
        }
    }

    return (
        <>
                <p className=" text-sm mb-1 md:text-base">Select Genre</p>
                <div className="w-2/3 relative">
                    <div 
                        className="border border-slate-300 rounded-md text-sm px-2 py-1 flex items-center md:text-base cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                        ref={dropdownRef}>
                        <p>{genre}</p>
                        <div className=" ml-auto mr-2">
                            <IoIosArrowDown />
                        </div>
                    </div>
                    {showDropdown &&
                        <div className="absolute bg-stone-50 border border-slate-300 mt-1 w-full rounded-md z-10 shadow-xl">
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer rounded-t-md" onClick={() => setGenre('Random')}>Random</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer" onClick={() => setGenre('Slice of Life')}>Slice of Life</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer" onClick={() => setGenre('Adventure')}>Adventure</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer" onClick={() => setGenre('Silly')}>Silly</p>
                            <p className=" text-sm px-2 py-2 hover:bg-stone-100 cursor-pointer rounded-b-md" onClick={() => setGenre('Mystery')}>Mystery</p>
                        </div>
                    }
                </div>
        </>
    )
}

export default GenreDropdown