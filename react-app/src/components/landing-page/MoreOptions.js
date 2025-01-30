import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";

function MoreOptions() {
    const [furigana, setFurigana] = useState(true)

    return (
        <div className="w-full">
            <div className=" mt-3 w-full">
                <p className=" text-sm mb-1">Select Genre</p>
                <div className="border border-slate-300 rounded-md text-sm px-2 py-1 w-2/3 flex items-center">
                    <p>Random</p>
                    <div className=" ml-auto mr-2">
                        <IoIosArrowDown />
                    </div>
                </div>
            </div>

            <div className=" mt-3 w-full">
                <p className=" text-sm mb-1">Main Characters Name</p>
                <div className="flex items-center gap-2">
                    <input type="text" placeholder="Enter name..." className="border border-slate-300 rounded-md text-sm px-2 py-1 w-2/3 outline-none bg-stone-50"/>
                    <div className=" text-lg cursor-pointer">
                        <CiCircleInfo />
                    </div>
                </div>
            </div>

            <div className=" mt-3 w-full">
                <p className=" text-sm mb-1">Furigana</p>
                <div className={`transition ${furigana ? `bg-teal-700` : `bg-stone-400`} duration-500 rounded-full p-1 w-12 flex cursor-pointer`} 
                    onClick={() => setFurigana(!furigana)}>
                    <div className={`h-5 w-5 rounded-full bg-stone-50 transition duration-500 ${furigana ? ` translate-x-full` : `translate-x-0`}`}></div>
                </div>
            </div>

        </div>
    )
}

export default MoreOptions