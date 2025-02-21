import { useContext, createContext, useState, useRef } from "react";

export const AudioValuesContext = createContext()

export function AudioValuesProvider({ children }) {
    const [audioURL, setAudioURL] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [controller, setController] = useState('') // controller so you can abort fetch if needed

    const audioPlayerRef = useRef(null)

    const audioValues = {
        audioURL, setAudioURL,
        isPlaying, setIsPlaying,
        isLoading, setIsLoading,
        controller, setController,

        audioPlayerRef
    }

    return (
        <AudioValuesContext.Provider value={audioValues}>
            {children}
        </AudioValuesContext.Provider>
    )
}

export function useAudioValues() {
    return useContext(AudioValuesContext)
}