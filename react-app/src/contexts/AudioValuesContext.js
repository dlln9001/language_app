import { useContext, createContext, useState } from "react";

export const AudioValuesContext = createContext()

export function AudioValuesProvider({ children }) {
    const [audioURL, setAudioURL] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [controller, setController] = useState('')

    const audioValues = {
        audioURL, setAudioURL,
        isPlaying, setIsPlaying,
        isLoading, setIsLoading,
        controller, setController
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