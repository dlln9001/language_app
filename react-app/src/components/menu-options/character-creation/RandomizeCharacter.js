

function RandomizeCharacter(props) {

    const randChars = ['もちこ', 'はるき', 'あおい', 'けんた', 'ゆい', 'そうた', 'みさき', 'りょう', 'ひなた', 'ゆうと', 'さくら', 'かいと', 'つむぎ', 'だいき', 'こはる', 'ゆうき', 
        'あかり', 'しょうた', 'りん', 'けいすけ', 'ななみ', 'こうた', 'あやね', 'りく', 'めい', 'あきら', 'あすか', 'あやの', 'えりか', 'えみ', 'いくみ', 'ひろき', 
        'いずみ', 'えいか', 'まゆ', 'なおみ', 'ゆたか', 'ゆか', 'まどか', 'まなみ', 'さやか', 'りょうた', 'りょうこ', 'さおり', 'ともこ', 'ともあき', 'あかね', 'あゆみ', 
        'あやこ', 'ひろこ']

    function randomizeCharacter() {
        // randomize name
        let name = randChars[Math.floor(Math.random() * randChars.length)]
        let tempTraits = {}
        
        // randomize traits
        for (let i = 0; i < props.pairTraits.length; i++) { 
            if (Math.random() < 0.6) {
                if (Math.random() < 0.5) {
                    tempTraits[i] = props.pairTraits[i][0]
                } 
                else {
                    tempTraits[i] = props.pairTraits[i][1]
                }
            }
        }

        for (let i = 0; i < props.singleTraits.length; i++) {
            let index = i+1
            if (Math.random() < 0.15) {
                tempTraits[-index] = props.singleTraits[i]
            }
            }
            props.setSelectedTraits(tempTraits)
        
            let array = Object.values(tempTraits)
            let displayed = array.join(', ')
            props.setDisplayedTraits(displayed)

        props.setNameInputed(name)
    }

    return (
        <button className="bg-teal-700 text-stone-50 w-full mt-5 rounded-md mb-2" onClick={randomizeCharacter}>Randomize</button>
    )
}

export default RandomizeCharacter;