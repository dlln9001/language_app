import { useEffect, useRef, useState } from "react"

import WordsListModal from "./WordsListModal";
import BlackBackground from "./BlackBackground";
import CharacterCreationModal from "./character-creation/CharacterCreationModels";

import { CiMenuBurger } from "react-icons/ci";


function MenuOptions() {
    const menuRef = useRef(null)
    const [showMenuOptions, setShowMenuOptions] = useState(false)

    const [showModal, setShowModal] = useState(0)

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    })

    function handleDocumentClick(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenuOptions(false)
        }
    }

    return (
        <>
            <div ref={menuRef} className="ml-auto mr-8 relative">
                <div className=" text-3xl cursor-pointer" onClick={() => setShowMenuOptions(!showMenuOptions)}>
                    <CiMenuBurger />
                </div>
                {showMenuOptions &&
                    <div className="absolute shadow-lg bg-stone-50 h-fit w-60 right-0 top-10 rounded-md border border-slate-300">
                        <p onClick={() => {
                            setShowModal(1)
                            setShowMenuOptions(false)
                        }} 
                        className="px-10 py-2 cursor-pointer hover:bg-stone-100 rounded-md">Words to Learn List</p>
                        <p onClick={() => {
                            setShowMenuOptions(false)
                            setShowModal(2)
                            }} 
                            className="px-10 py-2 cursor-pointer hover:bg-stone-100 rounded-md">
                                Character Creation
                        </p>
                    </div>
                }
            </div>
            
            {showModal && 
            <> 
                <div onClick={() => setShowModal(0)}>
                    <BlackBackground/>
                </div>
                {showModal === 1 &&
                    <WordsListModal setShowModal={setShowModal}/>
                }
                {showModal === 2 &&
                    <CharacterCreationModal setShowModal={setShowModal}/>
                }
            </>
            }
        </>
    )
}

export default MenuOptions