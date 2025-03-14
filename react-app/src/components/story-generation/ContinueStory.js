import { useState, useEffect } from "react";

import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { extractTextFromHTML } from "../landing-page/GenerateAudio";

import { IoMdRadioButtonOn } from "react-icons/io";
import { IoMdRadioButtonOff } from "react-icons/io";


function ContinueStory(props) {


    useEffect(() => {
        if (localStorage.getItem('storyHistory')) {
            const storyHistory = JSON.parse(localStorage.getItem('storyHistory'))
            props.setChoiceQuestion(storyHistory.choice_question)
            props.setOptionA(storyHistory.option_a)
            props.setOptionB(storyHistory.option_b)
        }
    }, [])


    function continueStory() {
        let option = ''

        if (props.optionSelected === 'A') {
            option = props.optionA
        }
        else if (props.optionSelected === 'B') {
            option = props.optionB
        }
        else if (props.optionSelected === 'C' || props.optionSelected === '') {
            if (Math.random() < 0.5) {
                option = props.optionA
            }
            else {
                option = props.optionB
            }
        }

        option = extractTextFromHTML(option)

        let raw_response = JSON.parse(localStorage.getItem('storyHistory')).raw_response

        props.setLoadingPrompt(true)

        fetch(`${process.env.REACT_APP_API_BASE_URL}/story-generator/continue-story/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                option_selected: option,
                raw_response: raw_response,
                story_settings: JSON.parse(localStorage.getItem('storySettings'))
            })
        })
            .then(res => res.json())
            .then(data => {

                props.setLoadingPrompt(false)

                let split_responses

                split_responses = data.response.split('%%%%')

                if (split_responses.length != 4) {
                    split_responses = ['Error parsing, regenerate story for no errors', data.response]
                    console.log('failed continue story prompt - ', data.response, 'failed')
                    props.setContextResponse('Sorry for the wait!')
                    continueStory()
                }
                else {
                    // console.log(data)

                    let story_response = marked.parse(split_responses[0])
                    let choice_question = marked.parse(split_responses[1])
                    let option_a = marked.parse(split_responses[2])
                    let option_b = marked.parse(split_responses[3])

                    const clean_story_response = DOMPurify.sanitize(story_response)
                    const clean_choice_question = DOMPurify.sanitize(choice_question)
                    const clean_option_a = DOMPurify.sanitize(option_a)
                    const clean_option_b = DOMPurify.sanitize(option_b)

                    let story_history = JSON.parse(localStorage.getItem('storyHistory'))

                    let raw_response = story_history.raw_response
                    let context_response = story_history.context_response
                    let story_for_audio = story_history.story_for_audio // story for audio is a list, split each new story section

                    story_for_audio.push(clean_story_response)

                    localStorage.setItem('storyHistory', JSON.stringify({
                        'raw_response': raw_response + data.response,
                        'context_response': context_response,
                        'story_for_audio': story_for_audio,
                        'choice_question': clean_choice_question, 'option_a': clean_option_a, 'option_b': clean_option_b
                    }))


                    props.setChoiceQuestion(clean_choice_question)
                    props.setOptionA(clean_option_a)
                    props.setOptionB(clean_option_b)
                    props.setOptionSelected('')

                    props.setStoryResponse(story_for_audio)
                }

            })
    }



    return (
        <>
            {props.choiceQuestion &&
                <div className="text-base flex flex-col gap-4 self-start">
                    <p dangerouslySetInnerHTML={{ __html: props.choiceQuestion }} className="mb-3"></p>

                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => props.setOptionSelected("A")}>
                        <div className="text-lg text-teal-700 mr-2">
                            {props.optionSelected === "A"
                                ?
                                <IoMdRadioButtonOn />
                                :
                                <IoMdRadioButtonOff />
                            }
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: props.optionA }}></p>
                    </div>

                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => props.setOptionSelected("B")}>
                        <div className="text-lg text-teal-700 mr-2">
                            {props.optionSelected === "B"
                                ?
                                <IoMdRadioButtonOn />
                                :
                                <IoMdRadioButtonOff />
                            }
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: props.optionB }}></p>
                    </div>

                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => props.setOptionSelected("C")}>
                        <div className="text-lg text-teal-700 mr-2">
                            {props.optionSelected === "C"
                                ?
                                <IoMdRadioButtonOn />
                                :
                                <IoMdRadioButtonOff />
                            }
                        </div>
                        <p>No preference</p>
                    </div>
                </div>
            }

            {(localStorage.getItem('storyHistory') && !props.loadingPrompt) &&
                <button className="bg-teal-700 text-stone-50 rounded-md w-full mt-6 md:text-lg font-semibold hover:bg-teal-800" onClick={continueStory}>continue story</button>
            }
        </>
    )
}

export default ContinueStory