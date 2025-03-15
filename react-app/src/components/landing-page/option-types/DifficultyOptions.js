import { setSettings } from "../LandingPage";

function DifficultyOptions(props) {
    return (
        <div className="border-2 border-teal-700 rounded-md w-full h-8 md:h-10 text-xs md:text-base text-teal-700 flex">
            <button 
                className={`border-2 border-y-0 border-transparent border-r-teal-700 h-full flex-grow basis-0 border-l-0
                        ${props.difficulty === props.levels[0] ? "bg-teal-700 text-stone-50" : "hover:bg-stone-100 rounded-l-md"}`} 
                onClick={() => setSettings(props.levels[0], "difficulty", props.setDifficulty, props.setLength)}>
                Entry
            </button>

            <button 
                className={`border-2 border-y-0 border-transparent border-r-teal-700 h-full flex-grow basis-0
                        ${props.difficulty === props.levels[1] ? "bg-teal-700 text-stone-50" : "hover:bg-stone-100"}`} 
                onClick={() => setSettings(props.levels[1], "difficulty", props.setDifficulty, props.setLength)}>
                Beginner
            </button>

            <button className={`flex-grow basis-0 ${props.difficulty === props.levels[2] ? "bg-teal-700 text-stone-50 " : "hover:bg-stone-100 rounded-r-md"}`}
                    onClick={() => setSettings(props.levels[2], "difficulty", props.setDifficulty, props.setLength)}>
                Low Intermediate
            </button>
        </div>
    )
}

export default DifficultyOptions;