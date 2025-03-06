import { useState } from "react";

import DeleteCharacter from "./DeleteCharacter";
import Traits from "./Traits";

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
    const randChars = ['もちこ', 'はるき', 'あおい', 'けんた', 'ゆい', 'そうた', 'みさき', 'りょう', 'ひなた', 'ゆうと', 'さくら', 'かいと', 'つむぎ', 'だいき', 'こはる', 'ゆうき', 
                        'あかり', 'しょうた', 'りん', 'けいすけ', 'ななみ', 'こうた', 'あやね', 'りく', 'めい', 'あきら', 'あすか', 'あやの', 'えりか', 'えみ', 'いくみ', 'ひろき', 
                        'いずみ', 'えいか', 'まゆ', 'なおみ', 'ゆたか', 'ゆか', 'まどか', 'まなみ', 'さやか', 'りょうた', 'りょうこ', 'さおり', 'ともこ', 'ともあき', 'あかね', 'あゆみ', 
                        'あやこ', 'ひろこ']

    function randomizeCharacter() {
        // randomize name
        let name = randChars[Math.floor(Math.random() * randChars.length)]
        let tempTraits = {}
        
        // randomize traits
        for (let i = 0; i < pairTraits.length; i++) { 
            if (Math.random() < 0.6) {
                if (Math.random() < 0.5) {
                    tempTraits[i] = pairTraits[i][0]
                } 
                else {
                    tempTraits[i] = pairTraits[i][1]
                }
            }
        }

        for (let i = 0; i < singleTraits.length; i++) {
            let index = i+1
            if (Math.random() < 0.15) {
                console.log(singleTraits[i])
                tempTraits[-index] = singleTraits[i]
            }
         }
         setSelectedTraits(tempTraits)
        
         let array = Object.values(tempTraits)
         let displayed = array.join(', ')
         setDisplayedTraits(displayed)

        setNameInputed(name)
    }

    function addCharacter() {
        if (nameInputed) {
            let characters = JSON.parse(localStorage.getItem('storySettings')).characters
            let newCharacter = {name: nameInputed, traits: Object.values(selectedTraits)}
            characters.unshift(newCharacter)
            
            let storySettings = JSON.parse(localStorage.getItem('storySettings'))
            storySettings.characters = characters
    
            setCharacters(characters)
            setNameInputed('')
            setSelectedTraits({})
            setDisplayedTraits('')
            
            localStorage.setItem('storySettings', JSON.stringify(storySettings))
        }
    }

    return (
        <div className="fixed bg-stone-50 z-50 w-[85%] h-[75%] md:h-[60%] md:w-[40%] 
                        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md flex flex-col p-4 overflow-auto custom-scrollbar">
            
            <div className="ml-auto text-4xl cursor-pointer md:sticky md:top-0" onClick={() => props.setShowModal(0)}>
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
                        className="border border-stone-300 bg-stone-50 rounded-md px-3 py-1 w-full outline-none focus:border-stone-400"/>
                
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

                <button className="bg-teal-700 text-stone-50 w-full mt-5 rounded-md mb-2" onClick={randomizeCharacter}>Randomize</button>

                <button className="bg-teal-700 text-stone-50 w-full mt-3 rounded-md py-1 mb-6" onClick={addCharacter}>Add Character</button>
                
                <div className="self-start w-full">
                    <p>Your Characters:</p>
                    <div>
                        {characters.map((character, index) => {

                            let displayed_traits = character.traits.join(', ')
                            return (
                                <div key={index}>
                                    <div className="flex items-center gap-3 mt-6 w-full cursor-pointer" 
                                        onClick={() => {
                                            if (showCharDetails[1] != index) {
                                                setShowCharDetails([true, index])
                                            }
                                            else {
                                                setShowCharDetails([!showCharDetails[0], index])
                                            }
                                        }}>
                                        <p className=" text-nowrap text-lg">{character.name}</p>
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