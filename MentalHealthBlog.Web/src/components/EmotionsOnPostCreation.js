import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedEmotions } from './redux-toolkit/features/emotionSlice'

import { PickedEmotions } from './PickedEmotions'
import { SuggestedEmotions } from './SuggestedEmotions'

export const EmotionsOnPostCreation = () => {
  let dispatch = useDispatch()

  let { dbEmotions, suggestedEmotions } = useSelector((store) => store.emotion)
  return (
    <>
      <div className="add-post-emotions-container">
        <label>Emotions</label>
        <br />

        <PickedEmotions />

        <input
          type="text"
          onFocus={() => {
            if (suggestedEmotions.length <= 0) {
              dispatch(setSuggestedEmotions(dbEmotions))
            }
          }}
          onKeyUp={(e) => {
            console.log('Suggested emotions ', suggestedEmotions)

            let dbEmotionsCopy = [...dbEmotions]

            if (e.target.value === '') {
              console.log('Emotion copy ', dbEmotionsCopy)
              dispatch(setSuggestedEmotions(dbEmotionsCopy))
              return
            }

            let suggestedEmotionsFromList = [...dbEmotionsCopy].filter(
              (emotion) => emotion.name.includes(e.target.value)
            )
            dispatch(setSuggestedEmotions(suggestedEmotionsFromList))
          }}
        />
      </div>

      <SuggestedEmotions />
    </>
  )
}
