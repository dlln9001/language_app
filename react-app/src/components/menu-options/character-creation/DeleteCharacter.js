import { useState } from "react"

function DeleteCharacter(props) {

    function deleteCharacter() {
        let storySettings = JSON.parse(localStorage.getItem('storySettings'))
        let characters = storySettings.characters
        
        characters.splice(props.charIndex, 1)
        storySettings.characters = characters
        localStorage.setItem('storySettings', JSON.stringify(storySettings))

        props.setShowCharDetails([false, -1])
        props.setCharacters(characters)
    }


    return (
        <div className="border w-fit rounded-md px-7 border-red-500 cursor-pointer" onClick={deleteCharacter}>
            <p className="text-red-500 text-sm">Delete</p>
        </div>
    )
}

export default DeleteCharacter