import { useState } from "react";

import { IoIosClose } from "react-icons/io";

function WordsListModal(props) {
    const [wordInputed, setWordInputed] = useState('')
    const [wordsList, setWordsList] = useState(JSON.parse(localStorage.getItem('storySettings')).wordsToLearn)
    const [forceUpdate, setForceUpdate] = useState(false)

    function addWord() {
        if (wordInputed) {
            let tempList = wordsList
            tempList.unshift(wordInputed)
            let storySettings = JSON.parse(localStorage.getItem('storySettings'))
            storySettings.wordsToLearn = tempList
            localStorage.setItem('storySettings', JSON.stringify(storySettings))
            setWordsList(tempList)
            setWordInputed('')
        }
    }

    function removeWord(index) {
        let tempList = wordsList
        tempList.splice(index, 1)
        let storySettings = JSON.parse(localStorage.getItem('storySettings'))
        storySettings.wordsToLearn = tempList
        localStorage.setItem('storySettings', JSON.stringify(storySettings))
        setWordsList(tempList)
        setForceUpdate(!forceUpdate)
    }

    return (
        <div className="fixed bg-stone-50 z-50 w-[85%] h-[75%] md:h-[60%] md:w-[40%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md flex flex-col p-4 overflow-hidden">

            <div className="ml-auto text-4xl cursor-pointer" onClick={() => props.setShowWordsListModal(false)}>
                <IoIosClose />
            </div>

            <div className="flex-grow flex flex-col items-center gap-5 mx-1 max-h-full">

                <h1 className="font-medium text-lg">Words to Learn List</h1>
                <p className="text-center text-sm">Personalize your learning! Enter Japanese words you're studying. Stories will feature these words more often to help you practice</p>

                <div className="w-full">
                    <input type="text" value={wordInputed} 
                        onChange={(e) => setWordInputed(e.target.value)}
                        placeholder="Enter word..."
                        className="border border-stone-300 bg-stone-50 rounded-md px-3 py-1 w-full outline-none focus:border-stone-400"/>
                    <button className="bg-teal-700 text-stone-50 w-full mt-3 rounded-md py-1" onClick={addWord}>Add to List</button>
                </div>

                <div className="self-start w-full min-h-32 max-h-[50%] bg-stone-50">
                    <p>Your List</p>
                    {wordsList 
                    ? 
                    <div className="overflow-auto custom-scrollbar w-full h-full mt-3 bg-stone-50">
                        {wordsList.map((word, index) => {
                            return (
                                <div key={index} className="flex items-center gap-3 mt-3 w-full">
                                    <p>{word}</p>
                                    <div className="cursor-pointer ml-auto" onClick={() => removeWord(index)}>
                                        <IoIosClose />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    : 
                    <p className=" text-sm text-stone-400 mt-3">No words added yet...</p>
                    }
                </div>

            </div>

        </div>
    )
}

export default WordsListModal