import { useState } from "react";

import { IoIosClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";


function CharacterCreationModal(props) {
    const [nameInputed, setNameInputed] = useState('')
    const [showTraits, setShowTraits] = useState(false)

    const pairTraits = [['Nice', 'Mean'], ['Brave', 'Cowardly'], ['Talkative', 'Shy'], ['Calm', 'Angry'], ['Smart', 'Airhead'], ['Cautious', 'Reckless']]
    const singleTraits = ['Energetic', 'Adventurous', 'Funny']

    return (
        <div className="fixed bg-stone-50 z-50 w-[85%] h-[75%] md:h-[60%] md:w-[40%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md flex flex-col p-4 overflow-hidden">
            
            <div className="ml-auto text-4xl cursor-pointer" onClick={() => props.setShowModal(0)}>
                <IoIosClose />
            </div>

            <div className="flex-grow flex flex-col items-center mx-1 md:mx-20 max-h-full">

                <div className="flex flex-col items-center w-full mb-4">
                    <h1 className="font-medium text-lg mb-1">Character Creation</h1>
                    <p className="text-center text-sm">Create your own character below</p>
                </div>

                <input type="text" value={nameInputed} 
                        onChange={(e) => setNameInputed(e.target.value)}
                        placeholder="Enter character name..."
                        className="border border-stone-300 bg-stone-50 rounded-md px-3 py-1 w-full outline-none focus:border-stone-400"/>


                <div className="self-start">
                    <div className="flex items-center gap-3 mt-4 mb-3 w-fit" onClick={() => setShowTraits(!showTraits)}>
                        <p>Show traits:</p>
                        {showTraits ? 
                            <div>
                                <IoIosArrowUp />
                            </div>
                        :
                            <div>
                                <IoIosArrowDown />
                            </div>
                        }
                    </div>
                    {showTraits &&
                        <div className="flex flex-wrap gap-3 text-teal-700">
                            {pairTraits.map((pair, index) => {
                                return (
                                    <div key={index} className="rounded-full border border-teal-700 flex gap-2 px-2 w-9/12">
                                        <p className="w-1/2 text-center border border-transparent border-r-teal-700 py-1">{pair[0]}</p>
                                        <p className="w-1/2 text-center py-1">{pair[1]}</p>
                                    </div>
                                )
                            })}
                            {singleTraits.map((trait, index) => {
                                return (
                                    <div key={index} className="rounded-full border border-teal-700 flex gap-2 px-2 w-5/12">
                                        <p className="w-full text-center py-1">{trait}</p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>

            </div>

        </div>
    )
}

export default CharacterCreationModal