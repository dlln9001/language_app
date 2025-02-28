import { useEffect, useRef, useState } from "react"
import { CiMenuBurger } from "react-icons/ci";


function MenuOptions() {
    const menuRef = useRef(null)
    const [showMenuOptions, setShowMenuOptions] = useState(false)

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    })

    function handleDocumentClick(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenuOptions(false)
        }
    }

    return (

        <div ref={menuRef} className="ml-auto mr-8 relative">
            <div className=" text-3xl cursor-pointer" onClick={() => setShowMenuOptions(!showMenuOptions)}>
                <CiMenuBurger />
            </div>
            {showMenuOptions &&
                <div className="absolute shadow-lg bg-stone-50 h-40 w-60 right-0 top-10 rounded-md border border-slate-300">
                    <p className="px-10 py-2 cursor-pointer hover:bg-stone-100 rounded-md">Words to Learn List</p>
                </div>
            }
        </div>
    )
}

export default MenuOptions