import { useState } from "react"

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function Traits(props) {

    const [forceUpdate, setForceUpdate] = useState(false)

    const [showTraits, setShowTraits] = useState(false)


    function selectTrait(index, trait) {
        let tempTraits = props.selectedTraits
        if (tempTraits[index] === trait) {
            delete tempTraits[index]
        }
        else {
            tempTraits[index] = trait
        }
        
        props.setSelectedTraits(tempTraits)
        
        let array = Object.values(tempTraits)
        let displayed = array.join(', ')
        props.setDisplayedTraits(displayed)
        
        setForceUpdate(!forceUpdate)
    }

    return (
        <div className="self-start w-full">

            <div className="flex items-center gap-3 mt-4 mb-1 w-fit cursor-pointer" onClick={() => setShowTraits(!showTraits)}>
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

            <p className=" text-wrap w-full mb-3 text-sm text-stone-400">selected traits: {props.displayedTraits}</p>

            {showTraits &&
                <div className="flex flex-wrap gap-3 text-teal-700">
                    {props.pairTraits.map((pair, index) => {
                        return (
                            <div key={index} className="rounded-full border border-teal-700 flex w-9/12 cursor-pointer">
                                <p className={`w-1/2 text-center border rounded-l-full border-l-0 border-y-0 border-r-teal-700 py-1 px-2
                                            ${props.selectedTraits[index] === pair[0] ? 'bg-teal-700 text-stone-50' : ''}`}
                                    onClick={() => selectTrait(index, pair[0])}>
                                        {pair[0]}
                                </p>
                                
                                <p className={`w-1/2 text-center py-1 rounded-r-full ${props.selectedTraits[index] === pair[1] ? 'bg-teal-700 text-stone-50' : ''}`}
                                    onClick={() => selectTrait(index, pair[1])}>
                                        {pair[1]}
                                </p>
                            </div>
                        )
                    })}
                    
                    {props.singleTraits.map((trait, index) => {
                        index += 1
                        return (
                            <div key={index} 
                                className={`rounded-full border border-teal-700 flex gap-2 px-2 w-5/12 cursor-pointer
                                ${props.selectedTraits[-index] === trait ? 'bg-teal-700 text-stone-50' : ''}`}
                                onClick={() => selectTrait(-index, trait)}>
                                <p className="w-full text-center py-1">{trait}</p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default Traits