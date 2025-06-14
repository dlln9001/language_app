import { useState, useEffect } from "react"

import DOMPurify from 'dompurify';
import { marked } from 'marked';


import GenerateAudio from "../landing-page/GenerateAudio";
import ContinueStory from "./ContinueStory";

function StoryGeneration() {
    const [loadingPrompt, setLoadingPrompt] = useState(false)

    const [contextResponse, setContextResponse] = useState(`<p class="text-sm text-center md:text-base"> Highlight any Japanese word you don't know. 
                                                            Then, click the book icon to see its meaning! </p> <br />`)
    const [storyResponse, setStoryResponse] = useState(['こんにちは！']) // story response only includes the story, so this is sent to generate audio

    const [choiceQuestion, setChoiceQuestion] = useState('')
    const [optionA, setOptionA] = useState('')
    const [optionB, setOptionB] = useState('')
    const [optionSelected, setOptionSelected] = useState('')

    useEffect(() => {
        if (localStorage.getItem('storyHistory')) {
            const storyHistory = JSON.parse(localStorage.getItem('storyHistory'))
            setContextResponse(storyHistory.context_response)
            setStoryResponse(storyHistory.story_for_audio)
        }
    }, [])

    function generateStory(reseted = false) {

        if (!reseted) {
            setContextResponse('')
        }

        setChoiceQuestion('')
        setStoryResponse('')
        setLoadingPrompt(true)

        fetch(`${process.env.REACT_APP_API_BASE_URL}/story-generator/generate-story/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                story_settings: JSON.parse(localStorage.getItem('storySettings'))
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoadingPrompt(false)

                let split_responses

                split_responses = data.response.split('%%%%')

                if (split_responses.length != 5) {
                    split_responses = ['Error parsing, regenerate story for no errors', data.response]
                    setChoiceQuestion('')
                    setOptionA('')
                    setOptionB('')
                    generateStory(reseted = true)
                }
                else {
                    let context_response = marked.parse(split_responses[0])
                    let story_response = marked.parse(split_responses[1])
                    let choice_question = marked.parse(split_responses[2])
                    let option_a = marked.parse(split_responses[3])
                    let option_b = marked.parse(split_responses[4])

                    const clean_context_response = DOMPurify.sanitize(context_response)
                    const clean_story_response = DOMPurify.sanitize(story_response)
                    const clean_choice_question = DOMPurify.sanitize(choice_question)
                    const clean_option_a = DOMPurify.sanitize(option_a)
                    const clean_option_b = DOMPurify.sanitize(option_b)

                    setChoiceQuestion(clean_choice_question)
                    setOptionA(clean_option_a)
                    setOptionB(clean_option_b)
                    setOptionSelected('')

                    localStorage.setItem('storyHistory', JSON.stringify({
                        'raw_response': data.response,
                        'context_response': clean_context_response,
                        'story_for_audio': [clean_story_response],
                        'choice_question': clean_choice_question, 'option_a': clean_option_a, 'option_b': clean_option_b
                    }))

                    setStoryResponse([clean_story_response])
                    setContextResponse(clean_context_response)

                }

            })
    }

    return (
        <>
            <button
                className="bg-teal-700 text-stone-50 rounded-md w-full py-1 md:py-2 mt-12 md:text-lg font-semibold hover:bg-teal-800"
                id="generate-story-id"
                onClick={() => {
                    if (!loadingPrompt) {
                        generateStory()
                    }
                }}>
                Generate Story
            </button>

            {(contextResponse && storyResponse) &&
                <div id='story-text-area'
                    className=" bg-stone-50 mt-4 text-lg md:text-2xl w-full h-full flex flex-col gap-5 md:gap-9 mb-7"
                >
                    <p dangerouslySetInnerHTML={{ __html: contextResponse }} className=" text-sm md:text-base"></p>

                    <hr />

                    {storyResponse.map((storySection, index) => {
                        return (
                            <div key={index}>
                                <div className="my-5">
                                    <GenerateAudio input_text={storySection} />
                                </div>

                                <p dangerouslySetInnerHTML={{ __html: storySection }} className="flex flex-col gap-9"></p>
                            </div>
                        )
                    })}
                </div>
            }

            <ContinueStory
                loadingPrompt={loadingPrompt} setLoadingPrompt={setLoadingPrompt}
                contextResponse={contextResponse} setContextResponse={setContextResponse}
                storyResponse={storyResponse} setStoryResponse={setStoryResponse}
                choiceQuestion={choiceQuestion} setChoiceQuestion={setChoiceQuestion}
                optionA={optionA} setOptionA={setOptionA}
                optionB={optionB} setOptionB={setOptionB}
                optionSelected={optionSelected} setOptionSelected={setOptionSelected}/>

            <hr className="mb-40" />

            {loadingPrompt &&
                <div role="status" className="mb-40">
                    <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-300 fill-teal-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            }
        </>
    )
}

export default StoryGeneration