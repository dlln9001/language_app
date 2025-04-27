import { useState } from "react";

import AddCharacter from "./AddCharacter";
import DeleteCharacter from "./DeleteCharacter";
import Traits from "./Traits";
import RandomizeCharacter from "./RandomizeCharacter";

import { IoIosClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";


function CharacterCreationModal(props) {

    const [nameInputed, setNameInputed] = useState('')
    
    const [selectedTraits, setSelectedTraits] = useState({})
    const [displayedTraits, setDisplayedTraits] = useState('')
    const pairTraits = [['Nice', 'Mean'], ['Brave', 'Cowardly'], ['Talkative', 'Shy'], ['Calm', 'Angry'], ['Smart', 'Airhead'], ['Cautious', 'Reckless']]
    const singleTraits = ['Energetic', 'Adventurous', 'Funny']

    const [characters, setCharacters] = useState(JSON.parse(localStorage.getItem('storySettings')).characters)
    const [showCharDetails, setShowCharDetails] = useState([false, -1])

    return (
        <div className="fixed bg-stone-50 z-50 w-[85%] h-[75%] md:h-[60%] md:w-[40%] 
                        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md flex flex-col p-4 overflow-auto custom-scrollbar"
            id="character-creation-modal">
            
            <div className="ml-auto text-4xl cursor-pointer md:sticky md:top-0" data-cy="close-character-modal" onClick={() => props.setShowModal(0)}>
                <IoIosClose />
            </div>

            <div className="flex-grow flex flex-col items-center mx-1 md:mx-20 max-h-full">

                <div className="flex flex-col items-center w-full mb-4">
                    <h1 className="font-medium text-lg mb-1">Character Creation</h1>
                    <p className="text-center text-sm">Create your own character below</p>
                </div>

                <input type="text" value={nameInputed} 
                        onChange={(e) => {
                            if ((e.target.value.length <= 25) || e.target.value === "") {
                                setNameInputed(e.target.value)
                            }
                        }}
                        placeholder="Enter character name..."
                        className="border border-stone-300 bg-stone-50 rounded-md px-3 py-1 w-full outline-none focus:border-stone-400"
                        id="character-name-input"/>
                
                {nameInputed.length === 25 &&
                    <p className="self-start text-xs text-red-500">Name too long</p>
                }


                <Traits
                    selectedTraits={selectedTraits}
                    setSelectedTraits={setSelectedTraits}
                    displayedTraits={displayedTraits}
                    setDisplayedTraits={setDisplayedTraits}
                    pairTraits={pairTraits}
                    singleTraits={singleTraits}/>

                <RandomizeCharacter
                    pairTraits={pairTraits}
                    singleTraits={singleTraits}
                    setSelectedTraits={setSelectedTraits}
                    setDisplayedTraits={setDisplayedTraits}
                    setNameInputed={setNameInputed}/>

                <AddCharacter
                    nameInputed={nameInputed}
                    setNameInputed={setNameInputed}
                    selectedTraits={selectedTraits}
                    setSelectedTraits={setSelectedTraits}
                    setCharacters={setCharacters}
                    setDisplayedTraits={setDisplayedTraits}/>
                
                <div className="self-start w-full">
                    <p>Your Characters:</p>
                    <div>
                        {characters.map((character, index) => {

                            let displayed_traits = character.traits.join(', ')
                            return (
                                <div key={index}>
                                    <div className="flex items-center gap-3 mt-6 w-full cursor-pointer" id="character-button"
                                        onClick={() => {
                                            if (showCharDetails[1] != index) {
                                                setShowCharDetails([true, index])
                                            }
                                            else {
                                                setShowCharDetails([!showCharDetails[0], index])
                                            }
                                        }}>
                                        <p className=" text-nowrap text-lg" id="character-name">{character.name}</p>
                                        <p className=" text-ellipsis text-nowrap overflow-hidden text-sm text-stone-400">{displayed_traits}</p>
                                        <div className="ml-auto">
                                            {showCharDetails[0] && showCharDetails[1] === index ? 
                                                <div>
                                                    <IoIosArrowUp />
                                                </div>
                                            :
                                                <div>
                                                    <IoIosArrowDown />
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    {showCharDetails[0] && showCharDetails[1] === index &&
                                        <div className="mt-2 text-sm">
                                            {displayed_traits 
                                            ?
                                                <p className=" text-stone-600">traits: {displayed_traits}</p>
                                            : 
                                                <p className=" text-stone-600">traits: no traits</p>
                                            }
                                            <div className="mt-2">
                                                <DeleteCharacter charIndex={index} setCharacters={setCharacters} setShowCharDetails={setShowCharDetails}/>
                                            </div>
                                            
                                        </div>
                                    }

                                </div>
                            )
                        })

                        }
                    </div>
                    <br />
                </div>

            </div>

        </div>
    )
}

export default CharacterCreationModal