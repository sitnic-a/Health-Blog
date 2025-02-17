import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedEmotions } from './redux-toolkit/features/emotionSlice'

export const EmotionsOnPostCreation = () => {
  let dispatch = useDispatch()
  let { dbEmotions, suggestedEmotions } = useSelector((store) => store.emotion)
  return (
    <>
      <div className="add-post-emotions-container">
        <label>Emotions</label>
        <br />
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

      {suggestedEmotions.length > 0 && (
        <div className="add-post-suggested-emotions-container">
          {suggestedEmotions.map((emotion) => {
            if (emotion.name.includes('Bad')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'red', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Happy')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'green', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Surprised')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'lightblue', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Angry')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'orange', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Sad')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'lightpink', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Disgusted')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'limegreen', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            } else if (emotion.name.includes('Fearful')) {
              return (
                <div
                  key={emotion.id}
                  className="add-post-suggested-emotion-container"
                  style={{ background: 'yellow', marginRight: '10px' }}
                >
                  {emotion.name}
                </div>
              )
            }
          })}
        </div>
      )}
    </>
  )
}
