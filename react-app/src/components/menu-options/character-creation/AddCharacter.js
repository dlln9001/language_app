

function AddCharacter(props) {

    function addCharacter() {
        if (props.nameInputed) {
            let characters = JSON.parse(localStorage.getItem('storySettings')).characters
            let newCharacter = {name: props.nameInputed, traits: Object.values(props.selectedTraits)}
            characters.unshift(newCharacter)
            
            let storySettings = JSON.parse(localStorage.getItem('storySettings'))
            storySettings.characters = characters
    
            props.setCharacters(characters)
            props.setNameInputed('')
            props.setSelectedTraits({})
            props.setDisplayedTraits('')
            
            localStorage.setItem('storySettings', JSON.stringify(storySettings))
        }
    }


    return (
        <button className="bg-teal-700 text-stone-50 w-full mt-3 rounded-md py-1 mb-6" onClick={addCharacter}>Add Character</button>
    )
}

export default AddCharacter;