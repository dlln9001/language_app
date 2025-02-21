import { useEffect } from "react";

import { useAudioValues } from "../../contexts/AudioValuesContext";

import { HiMiniSpeakerWave } from "react-icons/hi2";


export function extractTextFromHTML(htmlString) {
    const tempElement = document.createElement('div'); // Create a temporary div
    tempElement.innerHTML = htmlString;             // Set the HTML content
    return tempElement.textContent || tempElement.innerText || ""; // Get textContent or innerText
}

export function generateAudio(input_text, setController, controller, audioPlayerRef, setIsLoading, isLoading, setAudioURL) {

    if (isLoading) {
        controller.abort()
    }

    setIsLoading(true)
    let temp_controller = new AbortController()
    setController(temp_controller)

    const plainText = extractTextFromHTML(input_text) // 'input_text' has html tags, so need to remove them first

    const mediaSource = new MediaSource()
    audioPlayerRef.current.src = URL.createObjectURL(mediaSource)
    setAudioURL(true)

    fetch(`${process.env.REACT_APP_API_BASE_URL}/story-generator/generate-audio/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: plainText
        }),
        signal: temp_controller.signal
    })
    .then(res => {
        if (res.status !== 200) { 
            throw new Error(`error!`);
        }

        try {
            let sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg'); 

            const reader = res.body.getReader()

            function readChunk() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        if (!sourceBuffer.updating) { // Check if still updating as a precaution
                            mediaSource.endOfStream()
                        } else {
                            // Wait for 'updateend' event to call endOfStream
                            sourceBuffer.addEventListener('updateend', function endStreamHandler() {
                                sourceBuffer.removeEventListener('updateend', endStreamHandler) // Clean up listener
                                mediaSource.endOfStream()
                            })
                        }
                        return
                    }
    
                    sourceBuffer.appendBuffer(value)
                    setIsLoading(false)
    
                    return readChunk()
                })
            }
    
            readChunk()
            .catch(error => {
                console.error('Stream reading error:', error);
                reader.cancel(); // Cancel the stream on error
                })


        } catch (error) {
            console.error("Error adding source buffer:", error);
        }

    })
    .then(() => setController(''))
    .catch(error => { 
        if (error.name === 'AbortError') {
            console.log("Fetch aborted by user.");
        } else {
            console.error("Error generating audio:", error)
        }
    })
}

function GenerateAudio(props) {    
    const audioValues = useAudioValues()

    
    useEffect(() => {
        if (!audioValues.isLoading && !audioValues.audioURL) {
            generateAudio(props.storyResponse, audioValues.setController, audioValues.controller, audioValues.audioPlayerRef, 
                        audioValues.setIsLoading, audioValues.isLoading, audioValues.setAudioURL)
        }
    }, [])


    return (
        <>
        <div className={`text-2xl md:text-2xl w-4 h-4 ${(audioValues.isPlaying && audioValues.audioURL) ? 'text-teal-700' : 'text-stone-600'}`} onClick={() =>{
            if (audioValues.isPlaying) {
                audioValues.setIsPlaying(false)
                audioValues.audioPlayerRef.current.pause()
            }
            else if (audioValues.audioURL) {
                audioValues.setIsPlaying(true)
                audioValues.audioPlayerRef.current.play()
            }
            }}>
            {audioValues.isLoading 
            ? 
                <div role="status">
                    <svg aria-hidden="true" className="w-full h-full text-gray-200 animate-spin dark:text-gray-300 fill-teal-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            :    
            <HiMiniSpeakerWave />
            }
        </div>
        

        <div>
            <audio src='' type="audio/mpeg" ref={audioValues.audioPlayerRef} onEnded={() => {audioValues.setIsPlaying(false)}}  ></audio>
        </div>
        
        
        </>
    )
}

export default GenerateAudio