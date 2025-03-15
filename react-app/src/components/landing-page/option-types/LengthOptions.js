import { setSettings } from "../LandingPage"

function LengthOptions(props) {
    return (
        <div className="border-2 border-teal-700 rounded-md w-full h-8 md:h-10 text-xs md:text-base text-teal-700 flex">
            <button
                className={`border-2 border-y-0 border-transparent border-r-teal-700 h-full flex-grow basis-0
                        ${props.length === "Short" ? "bg-teal-700 text-stone-50" : "hover:bg-stone-100 rounded-l-md"}`}
                onClick={() => setSettings("Short", "length", props.setDifficulty, props.setLength)}>
                Short
            </button>

            <button
                className={`border-2 border-y-0 border-transparent border-r-teal-700 h-full flex-grow basis-0 
                        ${props.length === "Medium" ? "bg-teal-700 text-stone-50" : "hover:bg-stone-100"}`}
                onClick={() => setSettings("Medium", "length", props.setDifficulty, props.setLength)}>
                Medium
            </button>

            <button className={`flex-grow basis-0 ${props.length === "Long" ? "bg-teal-700 text-stone-50" : "hover:bg-stone-100 rounded-r-md"}`}
                onClick={() => setSettings("Long", "length", props.setDifficulty, props.setLength)}>
                Long
            </button>
        </div>
    )
}

export default LengthOptions